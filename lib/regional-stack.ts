import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { TheGraphQueryNode } from "./providers/TheGraphQueryNode";
import { RegionalAPI } from "./providers/RegionalAPI";
import { ResolverGdnStack } from "./resolver-gdn-stack";
import { VpcConnector } from "@aws-cdk/aws-apprunner-alpha";

interface StackProps extends cdk.StackProps {
	country: string;
	root: ResolverGdnStack;
}

export class RegionalStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props);

		const hostedzone = route53.PublicHostedZone.fromLookup(this, "HostedZone", {
			domainName: "resolver.gdn",
		});

		const certificate = new acm.Certificate(this, "Certificate", {
			domainName: `api.resolver.gdn`,
			validation: acm.CertificateValidation.fromDns(hostedzone),
		});

		const vpc = new ec2.Vpc(this, "Vpc", {
			maxAzs: 3,
			natGateways: 3,
			natGatewayProvider: ec2.NatProvider.instanceV2({ instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3A, ec2.InstanceSize.NANO) }),
			subnetConfiguration: [
				{
					name: "Public",
					subnetType: ec2.SubnetType.PUBLIC,
					cidrMask: 21,
				},
				{
					name: "Private",
					subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
					cidrMask: 21,
				},
			],
		});
		const cluster = new ecs.Cluster(this, "Cluster", { containerInsights: true, enableFargateCapacityProviders: true, vpc });
		const namespace = cluster.addDefaultCloudMapNamespace({
			name: `${cdk.Stack.of(this).region}.resolver.gdn.local`,
		});

		const secret = secretsmanager.Secret.fromSecretCompleteArn(
			this,
			"Secret",
			`arn:aws:secretsmanager:${cdk.Stack.of(this).region}:${cdk.Stack.of(this).account}:secret:resolver-gdn-secret-ROby3i`
		);

		const api = new RegionalAPI(this, "API", { vpc, secret, certificate });

		const graph = new TheGraphQueryNode(this, "TheGraphQueryNode", {
			cluster,
			namespace,
			secret,
			api: {
				lambdaFunction: api.lambdaFunction,
			},
		});
	}
}
