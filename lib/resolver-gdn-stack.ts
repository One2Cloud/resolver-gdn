import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecra from "aws-cdk-lib/aws-ecr-assets";
import path = require("path");
import { EDNS } from "./providers/EDNS";
import * as ec2 from "aws-cdk-lib/aws-ec2";

export class ResolverGdnStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const secret = new secretsmanager.Secret(this, "Secret");

		const vpc = new ec2.Vpc(this, "Vpc", {
			natGateways: 0,
			subnetConfiguration: [
				{
					subnetType: ec2.SubnetType.PUBLIC,
					name: "Public",
				},
			],
		});

		const cluster = new ecs.Cluster(this, "Cluster", {
			vpc,
			containerInsights: true,
			enableFargateCapacityProviders: true,
		});

		const ecsImages = new ecra.DockerImageAsset(this, "EcsImage", {
			directory: path.join(process.cwd(), "src/listener"),
			platform: ecra.Platform.LINUX_AMD64,
			file: "docker/Dockerfile",
		});

		const lambdaImage = new ecra.DockerImageAsset(this, "LambdaImage", {
			directory: path.join(process.cwd(), "src/listener"),
			platform: ecra.Platform.LINUX_AMD64,
			file: "docker/Dockerfile.lambda",
			buildArgs: {
				AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
				AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
				AWS_SESSION_TOKEN: process.env.AWS_SESSION_TOKEN!,
			},
		});

		new EDNS(this, "EDNS", {
			images: {
				lambda: lambdaImage,
				ecs: ecsImages,
			},
			secret,
			cluster,
		});
	}
}
