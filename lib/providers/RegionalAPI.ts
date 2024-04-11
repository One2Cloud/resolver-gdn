import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ecra from "aws-cdk-lib/aws-ecr-assets";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import path from "path";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as apigw2_integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53targets from "aws-cdk-lib/aws-route53-targets";

interface IConstructProps {
	vpc: ec2.IVpc;
	secret: secretsmanager.ISecret;
	certificate: acm.Certificate;
}

export class RegionalAPI extends Construct {
	public readonly lambdaFunction: lambda.Function;
	public readonly apigw: apigwv2.HttpApi;

	constructor(scope: Construct, id: string, props: IConstructProps) {
		super(scope, id);

		const image = new ecra.DockerImageAsset(this, "Image", {
			directory: path.join(process.cwd(), "src"),
			file: "docker/Dockerfile.lambda",
			platform: ecra.Platform.LINUX_AMD64,
			buildArgs: {
				AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
				AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
				AWS_SESSION_TOKEN: process.env.AWS_SESSION_TOKEN!,
			},
		});

		const lambdaFunction = new lambda.Function(this, "LambdaFunction", {
			functionName: "Resolver-GDN-Regional-API",
			code: lambda.Code.fromEcrImage(image.repository, {
				tagOrDigest: image.imageTag,
				cmd: ["handler.index"],
			}),
			handler: lambda.Handler.FROM_IMAGE,
			runtime: lambda.Runtime.FROM_IMAGE,
			timeout: cdk.Duration.seconds(30),
			memorySize: 256,
			environment: {
				THE_GRAPH_QUERY_HTTP_API_TESTNET_ENDPOINT: `http://testnet.graph-query-node.${cdk.Stack.of(this).region}.resolver.gdn.local:8080`,
				THE_GRAPH_QUERY_HTTP_API_MAINNET_ENDPOINT: `http://mainnet.graph-query-node.${cdk.Stack.of(this).region}.resolver.gdn.local:8080`,
				THE_GRAPH_QUERY_WEBSOCKET_API_TESTNET_ENDPOINT: `ws://testnet.graph-query-node.${cdk.Stack.of(this).region}.resolver.gdn.local:8081`,
				THE_GRAPH_QUERY_WEBSOCKET_API_MAINNET_ENDPOINT: `ws://mainnet.graph-query-node.${cdk.Stack.of(this).region}.resolver.gdn.local:8081`,
				GLOBAL_SECRET_ARN: props.secret.secretArn,
			},
			vpc: props.vpc,
			vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
		});
		props.secret.grantRead(lambdaFunction);
		this.lambdaFunction = lambdaFunction;
		const alias = new lambda.Alias(this, "Alias", {
			aliasName: "app",
			version: lambdaFunction.currentVersion,
		});
		const as = alias.addAutoScaling({ minCapacity: 1, maxCapacity: 1 });
		as.scaleOnUtilization({
			utilizationTarget: 0.8,
		});

		const dn = new apigwv2.DomainName(this, "DomainName", {
			domainName: "api.resolver.gdn",
			certificate: props.certificate,
		});
		const api = new apigwv2.HttpApi(this, "HttpApi", {
			apiName: "Resolver-GDN-Regional-API",
			defaultIntegration: new apigw2_integrations.HttpLambdaIntegration("LambdaIntegration", alias),
			disableExecuteApiEndpoint: false,
			defaultDomainMapping: {
				domainName: dn,
			},
		});
		this.apigw = api;

		new route53.ARecord(this, "ARecord", {
			recordName: "api",
			zone: route53.PublicHostedZone.fromLookup(this, "HostedZone", {
				domainName: "resolver.gdn",
			}),
			target: route53.RecordTarget.fromAlias(new route53targets.ApiGatewayv2DomainProperties(dn.regionalDomainName, dn.regionalHostedZoneId)),
			region: cdk.Stack.of(this).region,
		});
	}
}
