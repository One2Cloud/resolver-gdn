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
			memorySize: 128,
			timeout: cdk.Duration.seconds(30),
			handler: "index.handler",
			code: lambda.Code.fromDockerBuild(path.join(process.cwd(), "src"), {
				file: "docker/buildtime/Dockerfile.build",
				platform: "linux/amd64",
				buildArgs: {
					REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
					INFURA_API_KEY: process.env.INFURA_API_KEY || "",
					GETBLOCK_API_KEY: process.env.GETBLOCK_API_KEY || "",
					POKT_PORTAL_ID: process.env.POKT_PORTAL_ID || "",
					EDNS_HANDLER_SQS_QUEUE_URL: process.env.EDNS_EVENT_HANDLER_SQS_QUEUE_URL || "",
				},
			}),
		});

		const ednsMainnetMetadataBucket = s3.Bucket.fromBucketAttributes(this, "ImportedEdnsMainnetMetadataBucket", {
			bucketName: "edns-omni-file-folder",
			bucketRegionalDomainName: "edns-omni-file-folder.s3.ap-southeast-1.amazonaws.com",
		});

		const ednsTestnetMetadataBucket = s3.Bucket.fromBucketAttributes(this, "ImportedEdnsTestnetMetadataBucket", {
			bucketName: "edns-omni-dev-test",
			bucketRegionalDomainName: "edns-omni-dev-test.s3.ap-southeast-1.amazonaws.com",
		});

		const distribution = new cloudfront.Distribution(this, "Distribution", {
			certificate,
			domainNames: ["api.resolver.gdn"],
			defaultBehavior: {
				origin: new origins.S3Origin(bucket),
				originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_AND_CLOUDFRONT_2022,
				cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
				viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
				edgeLambdas: [
					{
						functionVersion: func.currentVersion,
						eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
					},
				],
			},
			additionalBehaviors: {
				"/metadata/*": {
					origin: new origins.S3Origin(ednsMainnetMetadataBucket),
					originRequestPolicy: cloudfront.OriginRequestPolicy.CORS_S3_ORIGIN,
					cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
					viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
				},
				"/testnet/metadata/*": {
					origin: new origins.S3Origin(ednsTestnetMetadataBucket),
					originRequestPolicy: cloudfront.OriginRequestPolicy.CORS_S3_ORIGIN,
					cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
					viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
				},
			},
		});

		// Add origin access control with workaround at https://github.com/aws/aws-cdk/issues/21771
		const cfCfnDist = distribution.node.defaultChild as cloudfront.CfnDistribution;
		const distribution_oac = new cloudfront.CfnOriginAccessControl(this, "DistributionOriginAccessControl", {
			originAccessControlConfig: {
				name: "DistributionOriginAccessControl",
				originAccessControlOriginType: "s3",
				signingBehavior: "always",
				signingProtocol: "sigv4",
			},
		});
		cfCfnDist.addOverride("Properties.DistributionConfig.Origins.0.S3OriginConfig.OriginAccessIdentity", ""); // Remove OAI
		cfCfnDist.addPropertyOverride("DistributionConfig.Origins.0.OriginAccessControlId", distribution_oac.getAtt("Id"));
		cfCfnDist.addOverride("Properties.DistributionConfig.Origins.1.S3OriginConfig.OriginAccessIdentity", ""); // Remove OAI
		cfCfnDist.addPropertyOverride("DistributionConfig.Origins.1.OriginAccessControlId", distribution_oac.getAtt("Id"));
		cfCfnDist.addOverride("Properties.DistributionConfig.Origins.2.S3OriginConfig.OriginAccessIdentity", ""); // Remove OAI
		cfCfnDist.addPropertyOverride("DistributionConfig.Origins.2.OriginAccessControlId", distribution_oac.getAtt("Id"));

		new route53.ARecord(this, "ApiDnsRecord", {
			zone: props.hostedzone,
			recordName: "api",
			target: route53.RecordTarget.fromAlias(new route53_targets.CloudFrontTarget(distribution)),
		});
	}
}
