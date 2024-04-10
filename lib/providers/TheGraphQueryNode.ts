import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as servicediscovery from "aws-cdk-lib/aws-servicediscovery";
import * as lambda from "aws-cdk-lib/aws-lambda";
interface IConstructProps {
	secret: secretsmanager.ISecret;
	cluster: ecs.Cluster;
	namespace: servicediscovery.INamespace;
	api: {
		lambdaFunction: lambda.Function;
	};
}

export class TheGraphQueryNode extends Construct {
	constructor(scope: Construct, id: string, props: IConstructProps) {
		super(scope, id);

		const testnetTaskDefinition = new ecs.FargateTaskDefinition(this, "TestnetTaskDefinition", {
			family: "The_Graph_Query_Node-Testnet",
			cpu: 512,
			memoryLimitMiB: 1024,
		});

		const testnetContainer = testnetTaskDefinition.addContainer("node", {
			image: ecs.ContainerImage.fromRegistry("graphprotocol/graph-node:v0.34.1"),
			environment: {
				GRAPH_GRAPHQL_QUERY_TIMEOUT: "10",
				GRAPH_GRAPHQL_HTTP_PORT: "8080",
				GRAPH_GRAPHQL_WS_PORT: "8081",
				GRAPH_CACHED_SUBGRAPH_IDS: "*",
				GRAPH_QUERY_CACHE_BLOCKS: "100",
				GRAPH_QUERY_CACHE_MAX_MEM: "10", // In MiB
				node_id: `query-node-testnet-${cdk.Stack.of(this).region}`,
				node_role: "query-node",
			},
			secrets: {
				postgres_user: ecs.Secret.fromSecretsManager(props.secret, "GRAPH_NODE_TESTNET_POSTGRES_USER"),
				postgres_pass: ecs.Secret.fromSecretsManager(props.secret, "GRAPH_NODE_TESTNET_POSTGRES_PASSWORD"),
				postgres_host: ecs.Secret.fromSecretsManager(props.secret, "GRAPH_NODE_TESTNET_POSTGRES_HOST"),
				postgres_port: ecs.Secret.fromSecretsManager(props.secret, "GRAPH_NODE_TESTNET_POSTGRES_PORT"),
				postgres_db: ecs.Secret.fromSecretsManager(props.secret, "GRAPH_NODE_TESTNET_POSTGRES_DB"),
				postgres_args: ecs.Secret.fromSecretsManager(props.secret, "GRAPH_NODE_TESTNET_POSTGRES_ARGS"),
			},
			logging: ecs.LogDriver.awsLogs({ streamPrefix: "The_Graph_Query_Node" }),
		});
		testnetContainer.addPortMappings({
			name: "http",
			containerPort: 8080,
		});
		testnetContainer.addPortMappings({
			name: "ws",
			containerPort: 8081,
		});
		if (testnetTaskDefinition.executionRole) {
			props.secret.grantRead(testnetTaskDefinition.executionRole);
		}

		// const testnet = new ecs.FargateService(this, "TestnetService", {
		// 	serviceName: "The_Graph_Query_Node-Testnet",
		// 	taskDefinition: testnetTaskDefinition,
		// 	cluster: props.cluster,
		// 	desiredCount: 1,
		// 	vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
		// 	cloudMapOptions: {
		// 		name: "testnet.graph-query-node",
		// 		cloudMapNamespace: props.namespace,
		// 	},
		// });
		// testnet.connections.allowFrom(props.api.lambdaFunction, ec2.Port.tcp(8080));
		// testnet.connections.allowFrom(props.api.lambdaFunction, ec2.Port.tcp(8081));
	}
}
