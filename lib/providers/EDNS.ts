import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as sfn_tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecra from "aws-cdk-lib/aws-ecr-assets";
import * as secretmanager from "aws-cdk-lib/aws-secretsmanager";
import * as kms from "aws-cdk-lib/aws-kms";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as lambda_event_sources from "aws-cdk-lib/aws-lambda-event-sources";

export interface ConstructProps {
	cluster: ecs.Cluster;
	images: {
		ecs: ecra.DockerImageAsset;
		lambda: ecra.DockerImageAsset;
	};
	secret: secretmanager.Secret;
}

export class EDNS extends Construct {
	public readonly workflow: sfn.StateMachine;

	constructor(scope: Construct, id: string, props: ConstructProps) {
		super(scope, id);

		const queue = new sqs.Queue(this, "Queue", {
			visibilityTimeout: cdk.Duration.minutes(3),
		});

		const handler = new lambda.Function(this, "Handler", {
			functionName: "EDNS-Event-Handler",
			code: lambda.Code.fromEcrImage(props.images.lambda.repository, {
				tagOrDigest: props.images.lambda.imageTag,
				cmd: ["handler.index"],
			}),
			handler: lambda.Handler.FROM_IMAGE,
			runtime: lambda.Runtime.FROM_IMAGE,
			timeout: cdk.Duration.minutes(1),
			memorySize: 512,
			environment: {
				GLOBAL_SECRET_ARN: props.secret.secretArn,
				SQS_HANDLER_URL: queue.queueUrl,
			},
		});
		props.secret.grantRead(handler);

		handler.addEventSource(
			new lambda_event_sources.SqsEventSource(queue, {
				maxBatchingWindow: cdk.Duration.minutes(1),
			})
		);

		const blockRangeRecordTable = new dynamodb.Table(this, "BlockRangeRecord", {
			partitionKey: {
				name: "chain_id",
				type: dynamodb.AttributeType.NUMBER,
			},
			billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
			removalPolicy: cdk.RemovalPolicy.DESTROY,
		});

		const listChainsLambdaFunction = new lambda.Function(this, "ListChains", {
			functionName: "EDNS-Listener-List-Chains",
			code: lambda.Code.fromEcrImage(props.images.lambda.repository, {
				tagOrDigest: props.images.lambda.imageTag,
				cmd: ["workflows/synchronizer/edns/01-list-chains.index"],
			}),
			handler: lambda.Handler.FROM_IMAGE,
			runtime: lambda.Runtime.FROM_IMAGE,
			timeout: cdk.Duration.seconds(15),
			memorySize: 256,
		});

		const getBlockRangeLambdaFunction = new lambda.Function(this, "GetBlockRange", {
			functionName: "EDNS-Listener-Get-Block-Range",
			code: lambda.Code.fromEcrImage(props.images.lambda.repository, {
				tagOrDigest: props.images.lambda.imageTag,
				cmd: ["workflows/synchronizer/edns/02-get-block-range.index"],
			}),
			handler: lambda.Handler.FROM_IMAGE,
			runtime: lambda.Runtime.FROM_IMAGE,
			timeout: cdk.Duration.seconds(15),
			memorySize: 256,
			environment: {
				BLOCK_RANGE_RECORD_TABLE_NAME: blockRangeRecordTable.tableName,
				GLOBAL_SECRET_ARN: props.secret.secretArn,
			},
		});
		blockRangeRecordTable.grantReadWriteData(getBlockRangeLambdaFunction);
		props.secret.grantRead(getBlockRangeLambdaFunction);

		const listEventsLambdaFunction = new lambda.Function(this, "ListEvents", {
			functionName: "EDNS-Listener-List-Events",
			code: lambda.Code.fromEcrImage(props.images.lambda.repository, {
				tagOrDigest: props.images.lambda.imageTag,
				cmd: ["workflows/synchronizer/edns/03-list-events.index"],
			}),
			handler: lambda.Handler.FROM_IMAGE,
			runtime: lambda.Runtime.FROM_IMAGE,
			timeout: cdk.Duration.seconds(15),
			memorySize: 256,
		});

		const syncEventLambdaFunction = new lambda.Function(this, "SyncEvent", {
			functionName: "EDNS-Listener-Sync-Event",
			code: lambda.Code.fromEcrImage(props.images.lambda.repository, {
				tagOrDigest: props.images.lambda.imageTag,
				cmd: ["workflows/synchronizer/edns/04-sync-event.index"],
			}),
			handler: lambda.Handler.FROM_IMAGE,
			runtime: lambda.Runtime.FROM_IMAGE,
			timeout: cdk.Duration.minutes(3),
			memorySize: 256,
			environment: {
				GLOBAL_SECRET_ARN: props.secret.secretArn,
			},
		});
		props.secret.grantRead(syncEventLambdaFunction);

		const task_01 = new sfn_tasks.LambdaInvoke(this, "01 - List Chains", {
			lambdaFunction: listChainsLambdaFunction,
			payloadResponseOnly: true,
			resultPath: "$.chains",
		});

		const task_02 = new sfn_tasks.LambdaInvoke(this, "02 - Get Block Range", {
			lambdaFunction: getBlockRangeLambdaFunction,
			payloadResponseOnly: true,
			payload: sfn.TaskInput.fromObject({
				chainId: sfn.JsonPath.numberAt(`$.chain`),
			}),
			resultPath: "$.range",
		});

		const task_03 = new sfn_tasks.LambdaInvoke(this, "03 - List Events", {
			lambdaFunction: listEventsLambdaFunction,
			payloadResponseOnly: true,
			resultPath: "$.events",
		});

		const task_04 = new sfn_tasks.LambdaInvoke(this, "04 - Sync Event", {
			lambdaFunction: syncEventLambdaFunction,
			payloadResponseOnly: true,
			payload: sfn.TaskInput.fromObject({
				chainId: sfn.JsonPath.numberAt(`$.chain`),
				from: sfn.JsonPath.numberAt(`$.from`),
				to: sfn.JsonPath.numberAt(`$.to`),
				eventType: sfn.JsonPath.numberAt(`$.event`),
			}),
			resultPath: "$.synced",
		});

		const task_05 = new sfn_tasks.DynamoPutItem(this, "05 - Update Block Range", {
			table: blockRangeRecordTable,
			item: {
				chain_id: sfn_tasks.DynamoAttributeValue.fromNumber(sfn.JsonPath.numberAt(`$.chain`)),
				from: sfn_tasks.DynamoAttributeValue.fromNumber(sfn.JsonPath.numberAt(`$.range.from`)),
				to: sfn_tasks.DynamoAttributeValue.fromNumber(sfn.JsonPath.numberAt(`$.range.to`)),
			},
			resultPath: sfn.JsonPath.DISCARD,
		});

		const chains_map = new sfn.Map(this, "Map - Chains", {
			maxConcurrency: 3,
			itemsPath: sfn.JsonPath.stringAt("$.chains"),
			parameters: {
				chain: sfn.JsonPath.stringAt("$$.Map.Item.Value"),
			},
			resultPath: sfn.JsonPath.DISCARD,
		});
		chains_map.iterator(task_02);

		task_02.next(task_03);

		const events_map = new sfn.Map(this, "Map - Events", {
			maxConcurrency: 3,
			itemsPath: sfn.JsonPath.stringAt("$.events"),
			parameters: {
				chain: sfn.JsonPath.numberAt("$.chain"),
				from: sfn.JsonPath.numberAt(`$.range.from`),
				to: sfn.JsonPath.numberAt(`$.range.to`),
				event: sfn.JsonPath.stringAt("$$.Map.Item.Value"),
			},
			resultPath: sfn.JsonPath.DISCARD,
		});
		events_map.iterator(task_04);
		task_03.next(events_map);
		events_map.next(task_05);

		const definition = task_01.next(chains_map);

		const workflow = new sfn.StateMachine(this, "Listener", {
			definition,
			stateMachineName: "EDNS-Events-Synchronizer",
		});
		this.workflow = workflow;
	}
}
