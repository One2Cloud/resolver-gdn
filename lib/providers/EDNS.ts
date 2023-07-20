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

		const queue = new sqs.Queue(this, "Queue", { visibilityTimeout: cdk.Duration.minutes(3) });

		const handler = new lambda.Function(this, "Handler", {
			functionName: "EDNS-Event-Handler",
			code: lambda.Code.fromEcrImage(props.images.lambda.repository, {
				tagOrDigest: props.images.lambda.imageTag,
			}),
			handler: lambda.Handler.FROM_IMAGE,
			runtime: lambda.Runtime.FROM_IMAGE,
			timeout: cdk.Duration.minutes(1),
			memorySize: 256,
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

		const taskDefinition = new ecs.FargateTaskDefinition(this, "TaskDefinition", {
			family: "EDNS",
			cpu: 2048,
			memoryLimitMiB: 4096,
		});
		taskDefinition.addContainer("mainnet", {
			image: ecs.ContainerImage.fromDockerImageAsset(props.images.ecs),
			environment: {
				MAINNET: "1",
				PROVIDER: "edns",
				SQS_HANDLER_URL: queue.queueUrl,
			},
			secrets: {
				REDIS_URL: ecs.Secret.fromSecretsManager(props.secret, "REDIS_URL"),
				INFURA_API_KEY: ecs.Secret.fromSecretsManager(props.secret, "INFURA_API_KEY"),
				GETBLOCK_API_KEY: ecs.Secret.fromSecretsManager(props.secret, "GETBLOCK_API_KEY"),
				POKT_PORTAL_ID: ecs.Secret.fromSecretsManager(props.secret, "POKT_PORTAL_ID"),
			},
			logging: ecs.LogDrivers.awsLogs({ streamPrefix: "EDNS_Mainnet" }),
			command: ["node", "listener.js"],
		});
		taskDefinition.addContainer("testnet", {
			image: ecs.ContainerImage.fromDockerImageAsset(props.images.ecs),
			environment: {
				MAINNET: "0",
				PROVIDER: "edns",
				SQS_HANDLER_URL: queue.queueUrl,
			},
			secrets: {
				REDIS_URL: ecs.Secret.fromSecretsManager(props.secret, "REDIS_URL"),
				INFURA_API_KEY: ecs.Secret.fromSecretsManager(props.secret, "INFURA_API_KEY"),
				GETBLOCK_API_KEY: ecs.Secret.fromSecretsManager(props.secret, "GETBLOCK_API_KEY"),
				POKT_PORTAL_ID: ecs.Secret.fromSecretsManager(props.secret, "POKT_PORTAL_ID"),
			},
			logging: ecs.LogDrivers.awsLogs({ streamPrefix: "EDNS_Testnet" }),
			command: ["node", "listener.js"],
		});

		new ecs.FargateService(this, "Service", {
			cluster: props.cluster,
			taskDefinition: taskDefinition,
			desiredCount: 1,
			vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
			assignPublicIp: true,
			// capacityProviderStrategies: [
			// 	{
			// 		capacityProvider: "FARGATE_SPOT",
			// 		weight: 2,
			// 	},
			// 	{
			// 		capacityProvider: "FARGATE",
			// 		weight: 1,
			// 	},
			// ],
		});
	}
}
