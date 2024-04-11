import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as servicediscovery from "aws-cdk-lib/aws-servicediscovery";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as efs from "aws-cdk-lib/aws-efs";

interface IConstructProps {
	vpc: ec2.IVpc;
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

		const fileSystem = new efs.FileSystem(this, "FileSystem", { vpc: props.vpc, vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS } });
		const accessPoint = fileSystem.addAccessPoint("AccessPoint", {
			createAcl: {
				ownerUid: "1001",
				ownerGid: "1001",
				permissions: "777",
			},
		});

		const ipfsTaskDefinition = new ecs.FargateTaskDefinition(this, "IpfsTaskDefinition", {
			family: "The_Graph_Query_Node-IPFS",
			cpu: 256,
			memoryLimitMiB: 512,
		});
		ipfsTaskDefinition.addVolume({
			name: "efs",
			efsVolumeConfiguration: {
				fileSystemId: fileSystem.fileSystemId,
				transitEncryption: "ENABLED",
				authorizationConfig: {
					accessPointId: accessPoint.accessPointId,
				},
			},
		});
		const ipfsContainer = ipfsTaskDefinition.addContainer("node", {
			image: ecs.ContainerImage.fromRegistry("ipfs/kubo:v0.17.0"),
			logging: ecs.LogDriver.awsLogs({ streamPrefix: "The_Graph_Query_Node-IPFS" }),
			portMappings: [
				{
					containerPort: 4001,
					protocol: ecs.Protocol.TCP,
				},
				{
					containerPort: 5001,
					protocol: ecs.Protocol.TCP,
				},
			],
		});
		ipfsContainer.addMountPoints({
			containerPath: "/data/ipfs",
			sourceVolume: "efs",
			readOnly: false,
		});
		const ipfs = new ecs.FargateService(this, "IpfsService", {
			serviceName: "The_Graph_Query_Node-IPFS",
			taskDefinition: ipfsTaskDefinition,
			cluster: props.cluster,
			desiredCount: 1,
			vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
			assignPublicIp: true,
			cloudMapOptions: {
				name: "ipfs",
				cloudMapNamespace: props.namespace,
			},
		});
		fileSystem.connections.allowDefaultPortFrom(ipfs.connections);
		ipfs.connections.allowFromAnyIpv4(ec2.Port.tcp(4001));

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
				ipfs: `ipfs.${cdk.Stack.of(this).region}.resolver.gdn.local:5001`,
				DISABLE_BLOCK_INGESTOR: "true",
			},
			secrets: {
				postgres_user: ecs.Secret.fromSecretsManager(props.secret, "GRAPH_NODE_TESTNET_POSTGRES_USER"),
				postgres_pass: ecs.Secret.fromSecretsManager(props.secret, "GRAPH_NODE_TESTNET_POSTGRES_PASSWORD"),
				postgres_host: ecs.Secret.fromSecretsManager(props.secret, "GRAPH_NODE_TESTNET_POSTGRES_HOST"),
				postgres_port: ecs.Secret.fromSecretsManager(props.secret, "GRAPH_NODE_TESTNET_POSTGRES_PORT"),
				postgres_db: ecs.Secret.fromSecretsManager(props.secret, "GRAPH_NODE_TESTNET_POSTGRES_DB"),
				postgres_args: ecs.Secret.fromSecretsManager(props.secret, "GRAPH_NODE_TESTNET_POSTGRES_ARGS"),
			},
			logging: ecs.LogDriver.awsLogs({ streamPrefix: "The_Graph_Query_Node-Testnet" }),
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

		const testnet = new ecs.FargateService(this, "TestnetService", {
			serviceName: "The_Graph_Query_Node-Testnet",
			taskDefinition: testnetTaskDefinition,
			cluster: props.cluster,
			desiredCount: 1,
			vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
			cloudMapOptions: {
				name: "testnet.graph-query-node",
				cloudMapNamespace: props.namespace,
			},
			capacityProviderStrategies: [
				{
					capacityProvider: "FARGATE",
					weight: 1,
				},
				{
					capacityProvider: "FARGATE_SPOT",
					weight: 2,
				},
			],
		});
		testnet.connections.allowFrom(props.api.lambdaFunction, ec2.Port.tcp(8080));
		testnet.connections.allowFrom(props.api.lambdaFunction, ec2.Port.tcp(8081));
		ipfs.connections.allowFrom(testnet.connections, ec2.Port.tcp(5001));

		const testnetScale = testnet.autoScaleTaskCount({ minCapacity: 1, maxCapacity: 4 });
		testnetScale.scaleOnCpuUtilization("cpu", { targetUtilizationPercent: 60 });
		testnetScale.scaleOnMemoryUtilization("memory", { targetUtilizationPercent: 80 });

		// === MAINNET == ///
		const mainnetTaskDefinition = new ecs.FargateTaskDefinition(this, "MainnetTaskDefinition", {
			family: "The_Graph_Query_Node-Mainnet",
			cpu: 256,
			memoryLimitMiB: 512,
		});

		const mainnetContainer = mainnetTaskDefinition.addContainer("node", {
			image: ecs.ContainerImage.fromRegistry("graphprotocol/graph-node:v0.34.1"),
			environment: {
				GRAPH_GRAPHQL_QUERY_TIMEOUT: "10",
				GRAPH_GRAPHQL_HTTP_PORT: "8080",
				GRAPH_GRAPHQL_WS_PORT: "8081",
				GRAPH_CACHED_SUBGRAPH_IDS: "*",
				GRAPH_QUERY_CACHE_BLOCKS: "100",
				GRAPH_QUERY_CACHE_MAX_MEM: "10", // In MiB
				node_id: `query-node-mainnet-${cdk.Stack.of(this).region}`,
				node_role: "query-node",
				ipfs: `ipfs.${cdk.Stack.of(this).region}.resolver.gdn.local:5001`,
				DISABLE_BLOCK_INGESTOR: "true",
			},
			secrets: {
				postgres_user: ecs.Secret.fromSecretsManager(props.secret, "GRAPH_NODE_MAINNET_POSTGRES_USER"),
				postgres_pass: ecs.Secret.fromSecretsManager(props.secret, "GRAPH_NODE_MAINNET_POSTGRES_PASSWORD"),
				postgres_host: ecs.Secret.fromSecretsManager(props.secret, "GRAPH_NODE_MAINNET_POSTGRES_HOST"),
				postgres_port: ecs.Secret.fromSecretsManager(props.secret, "GRAPH_NODE_MAINNET_POSTGRES_PORT"),
				postgres_db: ecs.Secret.fromSecretsManager(props.secret, "GRAPH_NODE_MAINNET_POSTGRES_DB"),
				postgres_args: ecs.Secret.fromSecretsManager(props.secret, "GRAPH_NODE_MAINNET_POSTGRES_ARGS"),
			},
			logging: ecs.LogDriver.awsLogs({ streamPrefix: "The_Graph_Query_Node-Mainnet" }),
		});
		mainnetContainer.addPortMappings({
			name: "http",
			containerPort: 8080,
		});
		mainnetContainer.addPortMappings({
			name: "ws",
			containerPort: 8081,
		});
		if (mainnetTaskDefinition.executionRole) {
			props.secret.grantRead(mainnetTaskDefinition.executionRole);
		}

		const mainnet = new ecs.FargateService(this, "MainnetService", {
			serviceName: "The_Graph_Query_Node-Mainnet",
			taskDefinition: mainnetTaskDefinition,
			cluster: props.cluster,
			desiredCount: 1,
			vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
			cloudMapOptions: {
				name: "mainnet.graph-query-node",
				cloudMapNamespace: props.namespace,
			},
			capacityProviderStrategies: [
				{
					capacityProvider: "FARGATE",
					weight: 1,
				},
				{
					capacityProvider: "FARGATE_SPOT",
					weight: 2,
				},
			],
		});
		mainnet.connections.allowFrom(props.api.lambdaFunction, ec2.Port.tcp(8080));
		mainnet.connections.allowFrom(props.api.lambdaFunction, ec2.Port.tcp(8081));
		ipfs.connections.allowFrom(mainnet.connections, ec2.Port.tcp(5001));

		const mainnetScale = mainnet.autoScaleTaskCount({ minCapacity: 2, maxCapacity: 12 });
		mainnetScale.scaleOnCpuUtilization("cpu", { targetUtilizationPercent: 60 });
		mainnetScale.scaleOnMemoryUtilization("memory", { targetUtilizationPercent: 80 });
	}
}
