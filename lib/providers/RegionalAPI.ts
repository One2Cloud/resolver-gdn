import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53_targets from "aws-cdk-lib/aws-route53-targets";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as ecra from "aws-cdk-lib/aws-ecr-assets";
import * as apprunner from "aws-cdk-lib/aws-apprunner";
import * as iam from "aws-cdk-lib/aws-iam";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as ec2 from "aws-cdk-lib/aws-ec2";

import path = require("path");

interface IConstructProps {
	secret: secretsmanager.Secret;
	queue: sqs.Queue;
}

export class RegionalAPI extends Construct {
	public readonly service: apprunner.CfnService;

	constructor(scope: Construct, id: string, props: IConstructProps) {
		super(scope, id);

		const secret = secretsmanager.Secret.fromSecretCompleteArn(this, "Secret", props.secret.secretName);

		new cdk.CfnOutput(this, "secretname", { value: props.secret.secretName });

		// const image = new ecra.DockerImageAsset(this, "Image", {
		// 	directory: path.join(process.cwd(), "src"),
		// 	file: "docker/Dockerfile",
		// 	platform: ecra.Platform.LINUX_AMD64,
		// });

		// const serviceRole = new iam.Role(this, "ServiceRole", {
		// 	assumedBy: new iam.ServicePrincipal("tasks.apprunner.amazonaws.com"),
		// });
		// secret.grantRead(serviceRole);
		// props.queue.grantSendMessages(serviceRole);

		// const imageAccessRole = new iam.Role(this, "ImageAccessRole", {
		// 	assumedBy: new iam.ServicePrincipal("build.apprunner.amazonaws.com"),
		// });
		// image.repository.grantPull(imageAccessRole);

		// const serviceAutoScalingConfiguration = new apprunner.CfnAutoScalingConfiguration(this, "ServiceAutoScalingConfiguration", {
		// 	autoScalingConfigurationName: "resolver-gdn-api-auto-scaling",
		// 	maxSize: 5,
		// });

		// const service = new apprunner.CfnService(this, "Service", {
		// 	serviceName: "resolver-gdn-api",
		// 	sourceConfiguration: {
		// 		authenticationConfiguration: {
		// 			accessRoleArn: imageAccessRole.roleArn,
		// 		},
		// 		imageRepository: {
		// 			imageRepositoryType: "ECR",
		// 			imageIdentifier: image.imageUri,
		// 			imageConfiguration: {
		// 				port: "8080",
		// 				runtimeEnvironmentSecrets: [
		// 					{
		// 						name: "REDIS_URL",
		// 						value: secret.secretValueFromJson("REDIS_URL").unsafeUnwrap(),
		// 					},
		// 					{
		// 						name: "INFURA_API_KEY",
		// 						value: secret.secretValueFromJson("INFURA_API_KEY").unsafeUnwrap(),
		// 					},
		// 					{
		// 						name: "GETBLOCK_API_KEY",
		// 						value: secret.secretValueFromJson("GETBLOCK_API_KEY").unsafeUnwrap(),
		// 					},
		// 					{
		// 						name: "POKT_PORTAL_ID",
		// 						value: secret.secretValueFromJson("POKT_PORTAL_ID").unsafeUnwrap(),
		// 					},
		// 				],
		// 				runtimeEnvironmentVariables: [
		// 					{
		// 						name: "EVENT_HANDLER_SQS_QUEUE_URL",
		// 						value: props.queue.queueUrl,
		// 					},
		// 				],
		// 				startCommand: "node index.js",
		// 			},
		// 		},
		// 	},
		// 	instanceConfiguration: {
		// 		cpu: "0.25 vCPU",
		// 		memory: "0.5 GB",
		// 		instanceRoleArn: serviceRole.roleArn,
		// 	},
		// 	networkConfiguration: {
		// 		ingressConfiguration: {
		// 			isPubliclyAccessible: true,
		// 		},
		// 	},
		// 	autoScalingConfigurationArn: serviceAutoScalingConfiguration.attrAutoScalingConfigurationArn,
		// });

		// new cdk.CfnOutput(this, "ServiceURL", { value: service.attrServiceUrl });
	}
}
