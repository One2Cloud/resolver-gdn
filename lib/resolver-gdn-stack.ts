import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecra from "aws-cdk-lib/aws-ecr-assets";
import path = require("path");
import { EDNS } from "./providers/EDNS";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfront_origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as sqs from "aws-cdk-lib/aws-sqs";

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

		const prod_s3Bucket = s3.Bucket.fromBucketArn(this, "ProdS3Bucket", "arn:aws:s3:::edns-omni-file-folder");
		const prod_s3Origin = new cloudfront_origins.S3Origin(prod_s3Bucket, {});

		const dev_s3Bucket = s3.Bucket.fromBucketArn(this, "DevS3Bucket", "arn:aws:s3:::edns-omni-dev-test");
		const dev_s3Origin = new cloudfront_origins.S3Origin(dev_s3Bucket);

		// const distribution = new cloudfront.Distribution(this, "Distribution", {
		// 	defaultBehavior: {
		// 		origin: new cloudfront_origins.HttpOrigin("route.api.resolver.gdn"),
		// 		allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
		// 		cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
		// 		originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_AND_CLOUDFRONT_2022,
		// 	},
		// 	additionalBehaviors: {
		// 		"/metadata/*": {
		// 			origin: prod_s3Origin,
		// 			cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
		// 		},
		// 		"/testnet/metadata/*": {
		// 			origin: dev_s3Origin,
		// 			cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
		// 		},
		// 	},
		// });
	}
}
