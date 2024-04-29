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
import * as apprunner from "aws-cdk-lib/aws-apprunner";
import * as iam from "aws-cdk-lib/aws-iam";

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

const AppRunnerConnectionArn: { [key: string]: string } = {
	"us-west-2": "arn:aws:lambda:us-west-2:580247275435:layer:LambdaInsightsExtension-Arm64:19",
	"ap-southeast-1": "arn:aws:apprunner:ap-southeast-1:578721297310:connection/Resolver-GDN/cf0551d7339746828f2cd6f31716bd48",
	"ap-northeast-1": "arn:aws:lambda:ap-northeast-1:580247275435:layer:LambdaInsightsExtension-Arm64:30",
	"eu-central-1": "arn:aws:lambda:eu-central-1:580247275435:layer:LambdaInsightsExtension-Arm64:19",
};

export class RegionalAPI extends Construct {
	public readonly lambdaFunction: lambda.Function;
	public readonly apigw: apigwv2.HttpApi;

	constructor(scope: Construct, id: string, props: IConstructProps) {
		super(scope, id);

		const autoScalingConfiguration = new apprunner.CfnAutoScalingConfiguration(this, "AutoScalingConfiguration", {
			autoScalingConfigurationName: "Resolver-GDN-ASC",
			maxConcurrency: 100,
			maxSize: 10,
			minSize: 1,
		});

		const instanceRole = new iam.Role(this, "InstanceRole", {
			assumedBy: new iam.ServicePrincipal("tasks.apprunner.amazonaws.com"),
		});
		props.secret.grantRead(instanceRole);

		const service = new apprunner.CfnService(this, "Service", {
			serviceName: "Resolver-GDN-API",
			autoScalingConfigurationArn: autoScalingConfiguration.attrAutoScalingConfigurationArn,
			healthCheckConfiguration: {
				healthyThreshold: 2,
				interval: 5,
				path: "/healthcheck",
				protocol: "HTTP",
				timeout: 1,
				unhealthyThreshold: 2,
			},
			instanceConfiguration: {
				cpu: "0.25 vCPU",
				memory: "0.5 GB",
				instanceRoleArn: instanceRole.roleArn,
			},
			networkConfiguration: {
				ingressConfiguration: {
					isPubliclyAccessible: true,
				},
				ipAddressType: "DUAL_STACK",
			},
			sourceConfiguration: {
				autoDeploymentsEnabled: true,
				authenticationConfiguration: {
					connectionArn: AppRunnerConnectionArn[cdk.Stack.of(this).region],
				},
				codeRepository: {
					repositoryUrl: "https://github.com/One2Cloud/resolver-gdn",
					sourceDirectory: "src",
					sourceCodeVersion: { type: "BRANCH", value: "@deploy/master" },
					codeConfiguration: {
						configurationSource: "API",
						codeConfigurationValues: {
							buildCommand: "npm ci && npm run build:api",
							startCommand: "node index.js",
							port: "8080",
							runtime: "NODEJS_18",
							runtimeEnvironmentVariables: [
								{
									name: "THE_GRAPH_QUERY_HTTP_API_TESTNET_ENDPOINT",
									value: "http://34.239.95.30:8000",
								},
								{
									name: "THE_GRAPH_QUERY_HTTP_API_MAINNET_ENDPOINT",
									value: "https://mainnet.graph.query.node.resolver.gdn",
								},
							],
							runtimeEnvironmentSecrets: [
								{
									name: "GLOBAL_SECRET_VALUE",
									value: props.secret.secretArn,
								},
								// {
								// 	name: "INFURA_API_KEY",
								// 	value: cdk.Fn.join(":", [props.secret.secretArn, "INFURA_API_KEY"]),
								// },
								// {
								// 	name: "GETBLOCK_API_KEY",
								// 	value: cdk.Fn.join(":", [props.secret.secretArn, "GETBLOCK_API_KEY"]),
								// },
								// {
								// 	name: "POKT_PORTAL_ID",
								// 	value: cdk.Fn.join(":", [props.secret.secretArn, "POKT_PORTAL_ID"]),
								// },
								// {
								// 	name: "GETBLOCK_CONFIG",
								// 	value: cdk.Fn.join(":", [props.secret.secretArn, "GETBLOCK_CONFIG"]),
								// },
								// {
								// 	name: "GROVE_CITY_APP_ID",
								// 	value: cdk.Fn.join(":", [props.secret.secretArn, "GROVE_CITY_APP_ID"]),
								// },
								// {
								// 	name: "UPSTASH_REDIS_REST_URL",
								// 	value: cdk.Fn.join(":", [props.secret.secretArn, "UPSTASH_REDIS_REST_URL"]),
								// },
								// {
								// 	name: "UPSTASH_REDIS_REST_TOKEN",
								// 	value: cdk.Fn.join(":", [props.secret.secretArn, "UPSTASH_REDIS_REST_TOKEN"]),
								// },
							],
						},
					},
				},
			},
		});

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
