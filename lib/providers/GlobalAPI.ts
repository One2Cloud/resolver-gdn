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

import path = require("path");

export interface ConstructProps {
	hostedzone: route53.IHostedZone;
}

export class GlobalApi extends Construct {
	public readonly workflow: sfn.StateMachine;

	constructor(scope: Construct, id: string, props: ConstructProps) {
		super(scope, id);

		const bucket = new s3.Bucket(this, "Bucket", {
			removalPolicy: cdk.RemovalPolicy.DESTROY,
		});

		const certificate = new acm.Certificate(this, "Certificate", {
			domainName: `resolver.gdn`,
			subjectAlternativeNames: [`api.resolver.gdn`],
			validation: acm.CertificateValidation.fromDns(props.hostedzone),
		});

		const func = new lambda.Function(this, "EdgeFunction", {
			functionName: "Resolver-GDN-Global-API",
			runtime: lambda.Runtime.NODEJS_18_X,
			memorySize: 256,
			timeout: cdk.Duration.seconds(30),
			handler: "index.handler",
			code: lambda.Code.fromDockerBuild(path.join(process.cwd(), "src/api"), {
				platform: "linux/amd64",
				buildArgs: {
					REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
					INFURA_API_KEY: process.env.INFURA_API_KEY || "",
					GETBLOCK_API_KEY: process.env.GETBLOCK_API_KEY || "",
					POKT_PORTAL_ID: process.env.POKT_PORTAL_ID || "",
				},
			}),
		});

		const distribution = new cloudfront.Distribution(this, "Distribution", {
			certificate,
			domainNames: ["api.resolver.gdn"],
			defaultBehavior: {
				origin: new origins.S3Origin(bucket),
				originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_AND_CLOUDFRONT_2022,
				cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
				edgeLambdas: [
					{
						functionVersion: func.currentVersion,
						eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
					},
				],
			},
		});

		new route53.ARecord(this, "ApiDnsRecord", {
			zone: props.hostedzone,
			recordName: "api",
			target: route53.RecordTarget.fromAlias(new route53_targets.CloudFrontTarget(distribution)),
		});
	}
}
