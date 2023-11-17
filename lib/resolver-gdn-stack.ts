import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecra from "aws-cdk-lib/aws-ecr-assets";
import path = require("path");
import { EDNS } from "./providers/EDNS";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53_targets from "aws-cdk-lib/aws-route53-targets";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfront_origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as acm from "aws-cdk-lib/aws-certificatemanager";

interface StackProps extends cdk.StackProps {
	availableRegions: string[];
}

export class ResolverGdnStack extends cdk.Stack {
	public readonly queue: sqs.Queue;
	public readonly hostedzone: route53.IHostedZone;
	public readonly secret: secretsmanager.Secret;

	constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props);

		this.hostedzone = route53.PublicHostedZone.fromLookup(this, "HostedZone", {
			domainName: "resolver.gdn",
		});

		this.secret = new secretsmanager.Secret(this, "Secret", {
			secretName: "resolver-gdn-secret",
			replicaRegions: [...props.availableRegions.map((region) => ({ region }))],
		});

		this.queue = new sqs.Queue(this, "EventHandlerQueue", { queueName: "event-handler-queue", visibilityTimeout: cdk.Duration.minutes(3) });

		const edns = new EDNS(this, "EDNS", {
			secret: this.secret,
			queue: this.queue,
		});

		const oac = new cloudfront.CfnOriginAccessControl(this, "AOC", {
			originAccessControlConfig: {
				name: "Degital Cloud - EDNS Omni - Origin Access Control",
				originAccessControlOriginType: "s3",
				signingBehavior: "always",
				signingProtocol: "sigv4",
			},
		});

		const prod_s3Bucket = s3.Bucket.fromBucketAttributes(this, "ProdS3Bucket", {
			bucketArn: "arn:aws:s3:::edns-omni-file-folder",
			region: "ap-southeast-1",
		});
		const prod_s3Origin = new cloudfront_origins.S3Origin(prod_s3Bucket, {});

		const dev_s3Bucket = s3.Bucket.fromBucketAttributes(this, "DevS3Bucket", {
			bucketArn: "arn:aws:s3:::edns-omni-dev-test",
			region: "ap-southeast-1",
		});
		const dev_s3Origin = new cloudfront_origins.S3Origin(dev_s3Bucket);

		const certificate = new acm.Certificate(this, "Certificate", {
			domainName: `static.resolver.gdn`,
			validation: acm.CertificateValidation.fromDns(this.hostedzone),
		});

		const distribution = new cloudfront.Distribution(this, "Distribution", {
			defaultBehavior: {
				origin: new cloudfront_origins.HttpOrigin("api.resolver.gdn"),
				allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
				cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
				originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_AND_CLOUDFRONT_2022,
			},
			additionalBehaviors: {
				"/metadata/*": {
					origin: prod_s3Origin,
					cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
				},
				"/testnet/metadata/*": {
					origin: dev_s3Origin,
					cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
				},
			},
			domainNames: ["static.resolver.gdn"],
			certificate,
		});

		new route53.ARecord(this, "ServiceEndpoint", {
			zone: this.hostedzone,
			target: route53.RecordTarget.fromAlias(new route53_targets.CloudFrontTarget(distribution)),
			recordName: "static",
		});
	}
}
