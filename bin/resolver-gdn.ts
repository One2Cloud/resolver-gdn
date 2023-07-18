#!/usr/bin/env node
import "source-map-support/register";
import * as dotenv from "dotenv";
import * as cdk from "aws-cdk-lib";
import { ResolverGdnStack } from "../lib/resolver-gdn-stack";

dotenv.config();

const app = new cdk.App();
new ResolverGdnStack(app, "ResolverGdnStack", {
	env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: "us-east-1" },
});
