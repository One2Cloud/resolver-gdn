import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";

import { RegionalAPI } from "./providers/RegionalAPI";
import { ResolverGdnStack } from "./resolver-gdn-stack";

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

		const api = new RegionalAPI(this, "API", { queue: props.root.queue, secret: props.root.secret });

		// new route53.CnameRecord(this, "ServiceEndpoint", {
		// 	zone: hostedzone,
		// 	domainName: api.service.serviceUrl,
		// 	recordName: "global-api",
		// 	geoLocation: route53.GeoLocation.country(props.country),
		// });
	}
}
