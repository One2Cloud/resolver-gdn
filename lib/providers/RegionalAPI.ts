import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import path from "path";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as apigw2_integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53targets from "aws-cdk-lib/aws-route53-targets";

interface IConstructProps {
	vpc: ec2.IVpc;
	secret: secretsmanager.ISecret;
	certificate: acm.Certificate;
}

const LambdaLayer: { [key: string]: { [key: string]: string } } = {
	LambdaInsight: {
		"us-west-2": "arn:aws:lambda:us-west-2:580247275435:layer:LambdaInsightsExtension-Arm64:19",
		"ap-southeast-1": "arn:aws:lambda:ap-southeast-1:580247275435:layer:LambdaInsightsExtension-Arm64:19",
		"ap-northeast-1": "arn:aws:lambda:ap-northeast-1:580247275435:layer:LambdaInsightsExtension-Arm64:30",
		"eu-central-1": "arn:aws:lambda:eu-central-1:580247275435:layer:LambdaInsightsExtension-Arm64:19",
	},
	ParameterAndSecrets: {
		"us-west-2": "arn:aws:lambda:us-west-2:345057560386:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:11",
		"ap-southeast-1": "arn:aws:lambda:ap-southeast-1:044395824272:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:11",
		"ap-northeast-1": "arn:aws:lambda:ap-northeast-1:133490724326:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:11",
		"eu-central-1": "arn:aws:lambda:eu-central-1:187925254637:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:11",
	},
};

export class RegionalAPI extends Construct {
	public readonly lambdaFunction: lambda.Function;
	public readonly apigw: apigwv2.HttpApi;

	constructor(scope: Construct, id: string, props: IConstructProps) {
		super(scope, id);

		const lambdaInsight = lambda.LayerVersion.fromLayerVersionArn(this, "LambdaInsight", LambdaLayer.LambdaInsight[cdk.Stack.of(this).region]);
		const parameterAndSecrets = lambda.LayerVersion.fromLayerVersionArn(this, "ParameterAndSecrets", LambdaLayer.ParameterAndSecrets[cdk.Stack.of(this).region]);

		const lambdaFunction = new lambda.Function(this, "LambdaFunction", {
			functionName: "Resolver-GDN-Regional-API",
			code: lambda.Code.fromDockerBuild(path.join(process.cwd(), "src"), {
				file: "docker/Dockerfile.lambda.esbuild",
			}),
			layers: [lambdaInsight, parameterAndSecrets],
			handler: "handler.index",
			runtime: lambda.Runtime.NODEJS_20_X,
			architecture: lambda.Architecture.ARM_64,
			timeout: cdk.Duration.seconds(30),
			memorySize: 256,
			environment: {
				THE_GRAPH_QUERY_HTTP_API_TESTNET_ENDPOINT: `http://34.239.95.30:8000`,
				THE_GRAPH_QUERY_HTTP_API_MAINNET_ENDPOINT: `https://mainnet.graph.query.node.resolver.gdn`,
				GLOBAL_SECRET_ARN: props.secret.secretArn,
			},
		});
		props.secret.grantRead(lambdaFunction);
		this.lambdaFunction = lambdaFunction;
		const alias = new lambda.Alias(this, "Alias", {
			aliasName: "app",
			version: lambdaFunction.currentVersion,
		});
		const as = alias.addAutoScaling({ minCapacity: 3, maxCapacity: 10 });
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
