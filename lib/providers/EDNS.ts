import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as sfn_tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as ecra from "aws-cdk-lib/aws-ecr-assets";
import * as secretmanager from "aws-cdk-lib/aws-secretsmanager";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as lambda_event_sources from "aws-cdk-lib/aws-lambda-event-sources";
import * as logs from "aws-cdk-lib/aws-logs";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import path = require("path");

export interface ConstructProps {
	secret: secretmanager.Secret;
	cluster: ecs.Cluster;
	queue: sqs.Queue;
}

export class EDNS extends Construct {
	public readonly workflow: sfn.StateMachine;

	constructor(scope: Construct, id: string, props: ConstructProps) {
		super(scope, id);

		const blockRangeRecordTable = new dynamodb.Table(this, "BlockRangeRecord", {
			partitionKey: {
				name: "chain_id",
				type: dynamodb.AttributeType.NUMBER,
			},
			billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
			removalPolicy: cdk.RemovalPolicy.DESTROY,
		});

		const ecs_image = new ecra.DockerImageAsset(this, "EcsImage", {
			directory: path.join(process.cwd(), "src"),
			platform: ecra.Platform.LINUX_AMD64,
			file: "docker/Dockerfile",
		});

		const taskDefinition = new ecs.FargateTaskDefinition(this, "TaskDefinition", {
			family: "EDNS-Event-Synchronizer",
			cpu: 1024,
			memoryLimitMiB: 2048,
		});
		const containerDefinition = taskDefinition.addContainer("runner", {
			image: ecs.ContainerImage.fromDockerImageAsset(ecs_image),
			environment: { BLOCK_RANGE_RECORD_TABLE_NAME: blockRangeRecordTable.tableName },
			secrets: {
				REDIS_URL: ecs.Secret.fromSecretsManager(props.secret, "REDIS_URL"),
				INFURA_API_KEY: ecs.Secret.fromSecretsManager(props.secret, "INFURA_API_KEY"),
				GETBLOCK_API_KEY: ecs.Secret.fromSecretsManager(props.secret, "GETBLOCK_API_KEY"),
				POKT_PORTAL_ID: ecs.Secret.fromSecretsManager(props.secret, "POKT_PORTAL_ID"),
			},
			logging: ecs.LogDriver.awsLogs({ streamPrefix: "Alibaba_Cloud_Account_Synchronizer" }),
			command: ["node", "app/listener/index.js"],
		});
		if (taskDefinition.executionRole) props.secret.grantRead(taskDefinition.executionRole);
		if (taskDefinition.taskRole) {
			props.secret.grantRead(taskDefinition.taskRole);
			blockRangeRecordTable.grantReadWriteData(taskDefinition.taskRole);
		}

		new ecs.FargateService(this, "SynchronizerService", {
			taskDefinition,
			desiredCount: 1,
			cluster: props.cluster,
			vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
			assignPublicIp: false,
		});

		const lambda_image = new ecra.DockerImageAsset(this, "LambdaImage", {
			directory: path.join(process.cwd(), "src"),
			platform: ecra.Platform.LINUX_AMD64,
			file: "docker/Dockerfile.lambda",
			buildArgs: {
				AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
				AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
				AWS_SESSION_TOKEN: process.env.AWS_SESSION_TOKEN!,
			},
		});

		const handler = new lambda.Function(this, "Handler", {
			functionName: "EDNS-Event-Handler",
			code: lambda.Code.fromEcrImage(lambda_image.repository, {
				tagOrDigest: lambda_image.imageTag,
				cmd: ["app/listener/handler.index"],
			}),
			handler: lambda.Handler.FROM_IMAGE,
			runtime: lambda.Runtime.FROM_IMAGE,
			timeout: cdk.Duration.minutes(1),
			memorySize: 512,
			environment: {
				SECRET_ARN: props.secret.secretArn,
				EVENT_HANDLER_SQS_QUEUE_URL: props.queue.queueUrl,
			},
		});
		props.secret.grantRead(handler);

		handler.addEventSource(
			new lambda_event_sources.SqsEventSource(props.queue, {
				maxBatchingWindow: cdk.Duration.minutes(1),
			})
		);

		// const listChainsLambdaFunction = new lambda.Function(this, "ListChains", {
		// 	functionName: "EDNS-Listener-List-Chains",
		// 	code: lambda.Code.fromEcrImage(image.repository, {
		// 		tagOrDigest: image.imageTag,
		// 		cmd: ["workflows/synchronizer/edns/01-list-chains.index"],
		// 	}),
		// 	handler: lambda.Handler.FROM_IMAGE,
		// 	runtime: lambda.Runtime.FROM_IMAGE,
		// 	timeout: cdk.Duration.seconds(15),
		// 	memorySize: 256,
		// });

		// const getBlockRangeLambdaFunction = new lambda.Function(this, "GetBlockRange", {
		// 	functionName: "EDNS-Listener-Get-Block-Range",
		// 	code: lambda.Code.fromEcrImage(image.repository, {
		// 		tagOrDigest: image.imageTag,
		// 		cmd: ["workflows/synchronizer/edns/02-get-block-range.index"],
		// 	}),
		// 	handler: lambda.Handler.FROM_IMAGE,
		// 	runtime: lambda.Runtime.FROM_IMAGE,
		// 	timeout: cdk.Duration.seconds(15),
		// 	memorySize: 256,
		// 	environment: {
		// 		BLOCK_RANGE_RECORD_TABLE_NAME: blockRangeRecordTable.tableName,
		// 		SECRET_ARN: props.secret.secretArn,
		// 	},
		// });
		// blockRangeRecordTable.grantReadWriteData(getBlockRangeLambdaFunction);
		// props.secret.grantRead(getBlockRangeLambdaFunction);

		// const listEventsLambdaFunction = new lambda.Function(this, "ListEvents", {
		// 	functionName: "EDNS-Listener-List-Events",
		// 	code: lambda.Code.fromEcrImage(image.repository, {
		// 		tagOrDigest: image.imageTag,
		// 		cmd: ["workflows/synchronizer/edns/03-list-events.index"],
		// 	}),
		// 	handler: lambda.Handler.FROM_IMAGE,
		// 	runtime: lambda.Runtime.FROM_IMAGE,
		// 	timeout: cdk.Duration.seconds(15),
		// 	memorySize: 256,
		// });

		// const syncEventLambdaFunction = new lambda.Function(this, "SyncEvent", {
		// 	functionName: "EDNS-Listener-Sync-Event",
		// 	code: lambda.Code.fromEcrImage(image.repository, {
		// 		tagOrDigest: image.imageTag,
		// 		cmd: ["workflows/synchronizer/edns/04-sync-event.index"],
		// 	}),
		// 	handler: lambda.Handler.FROM_IMAGE,
		// 	runtime: lambda.Runtime.FROM_IMAGE,
		// 	timeout: cdk.Duration.minutes(3),
		// 	memorySize: 256,
		// 	environment: {
		// 		SECRET_ARN: props.secret.secretArn,
		// 		EVENT_HANDLER_SQS_QUEUE_URL: props.queue.queueUrl,
		// 	},
		// });
		// props.secret.grantRead(syncEventLambdaFunction);
		// props.queue.grantSendMessages(syncEventLambdaFunction);

		// const task_01 = new sfn_tasks.LambdaInvoke(this, "01 - List Chains", {
		// 	lambdaFunction: listChainsLambdaFunction,
		// 	payloadResponseOnly: true,
		// 	resultPath: "$.chains",
		// });

		// const task_02 = new sfn_tasks.LambdaInvoke(this, "02 - Get Block Range", {
		// 	lambdaFunction: getBlockRangeLambdaFunction,
		// 	payloadResponseOnly: true,
		// 	payload: sfn.TaskInput.fromObject({
		// 		chainId: sfn.JsonPath.numberAt(`$.chain`),
		// 		net: sfn.JsonPath.stringAt(`$.net`),
		// 	}),
		// 	resultPath: "$.range",
		// });

		// const task_03 = new sfn_tasks.LambdaInvoke(this, "03 - List Events", {
		// 	lambdaFunction: listEventsLambdaFunction,
		// 	payloadResponseOnly: true,
		// 	resultPath: "$.events",
		// });

		// const task_04 = new sfn_tasks.LambdaInvoke(this, "04 - Sync Event", {
		// 	lambdaFunction: syncEventLambdaFunction,
		// 	payloadResponseOnly: true,
		// 	payload: sfn.TaskInput.fromObject({
		// 		chainId: sfn.JsonPath.numberAt(`$.chain`),
		// 		from: sfn.JsonPath.numberAt(`$.from`),
		// 		to: sfn.JsonPath.numberAt(`$.to`),
		// 		eventType: sfn.JsonPath.numberAt(`$.event`),
		// 		net: sfn.JsonPath.stringAt(`$.net`),
		// 	}),
		// 	resultPath: "$.synced",
		// });
		// task_04.addRetry({ maxAttempts: 3 });

		// const task_05 = new sfn_tasks.DynamoPutItem(this, "05 - Update Block Range", {
		// 	table: blockRangeRecordTable,
		// 	item: {
		// 		chain_id: sfn_tasks.DynamoAttributeValue.numberFromString(sfn.JsonPath.stringAt(`States.Format('{}', $.chain)`)),
		// 		from: sfn_tasks.DynamoAttributeValue.numberFromString(sfn.JsonPath.stringAt(`States.Format('{}', $.range.from)`)),
		// 		to: sfn_tasks.DynamoAttributeValue.numberFromString(sfn.JsonPath.stringAt(`States.Format('{}', $.range.to)`)),
		// 	},
		// 	resultPath: sfn.JsonPath.DISCARD,
		// });

		// const chains_map = new sfn.Map(this, "Map - Chains", {
		// 	maxConcurrency: 3,
		// 	itemsPath: sfn.JsonPath.stringAt("$.chains"),
		// 	parameters: {
		// 		chain: sfn.JsonPath.stringAt("$$.Map.Item.Value"),
		// 		net: sfn.JsonPath.stringAt("$.net"),
		// 	},
		// 	resultPath: sfn.JsonPath.DISCARD,
		// });
		// chains_map.iterator(task_02);

		// task_02.next(task_03);

		// const events_map = new sfn.Map(this, "Map - Events", {
		// 	itemsPath: sfn.JsonPath.stringAt("$.events"),
		// 	parameters: {
		// 		chain: sfn.JsonPath.stringAt("$.chain"),
		// 		from: sfn.JsonPath.numberAt(`$.range.from`),
		// 		to: sfn.JsonPath.numberAt(`$.range.to`),
		// 		event: sfn.JsonPath.stringAt("$$.Map.Item.Value"),
		// 		net: sfn.JsonPath.stringAt("$.net"),
		// 	},
		// 	resultPath: sfn.JsonPath.DISCARD,
		// });
		// events_map.iterator(task_04);
		// task_03.next(events_map);
		// events_map.next(task_05);

		// const definition = task_01.next(chains_map);

		// this.workflow = new sfn.StateMachine(this, "Listener", {
		// 	definition,
		// 	stateMachineName: "EDNS-Events-Synchronizer",
		// 	stateMachineType: sfn.StateMachineType.EXPRESS,
		// 	logs: {
		// 		destination: new logs.LogGroup(this, "LogGroup", { retention: logs.RetentionDays.ONE_MONTH }),
		// 		includeExecutionData: true,
		// 		level: sfn.LogLevel.ALL,
		// 	},
		// });
	}
}
