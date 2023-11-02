#!/usr/bin/env node
import "source-map-support/register";
import * as dotenv from "dotenv";
import * as cdk from "aws-cdk-lib";
import { ResolverGdnStack } from "../lib/resolver-gdn-stack";
import { RegionalStack } from "../lib/regional-stack";

dotenv.config();

const app = new cdk.App();

const root = new ResolverGdnStack(app, "ResolverGdnStack", {
	availableRegions: ["us-west-2", "ap-southeast-1", "ap-northeast-1", "eu-central-1"],
	env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: "us-east-1" },
	crossRegionReferences: true,
});

const us = new RegionalStack(app, "UnitedStates-RegionalStack", {
	root,
	country: "US",
	crossRegionReferences: true,
	env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: "us-west-2" },
});
const sg = new RegionalStack(app, "Singapore-RegionalStack", {
	root,
	country: "SG",
	crossRegionReferences: true,
	env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: "ap-southeast-1" },
});
const jp = new RegionalStack(app, "Japan-RegionalStack", {
	root,
	country: "JP",
	crossRegionReferences: true,
	env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: "ap-northeast-1" },
});
const de = new RegionalStack(app, "Germany-RegionalStack", {
	root,
	country: "DE",
	crossRegionReferences: true,
	env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: "eu-central-1" },
});
