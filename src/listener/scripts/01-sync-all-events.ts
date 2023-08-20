import * as dotenv from "dotenv";
dotenv.config();

import { Network, getNetworkConfig } from "../src/ethereum-network-config";
import _ from "lodash";
import { Lambda } from "@aws-sdk/client-lambda";
import { JsonRpcProvider } from "@ethersproject/providers";
import { EdnsEventType } from "../src/constants/event-type.constant";
import { setEnvironmentVariable } from "../src/utils/set-environment-variable";

const NETWORK = Network.POLYGON_MUMBAI;
// const FROM = 8960446; // Goerli
const FROM = 33126861; // Polygon Mumbai
const BATCH = 200;

async function main() {
	await setEnvironmentVariable();

	const NetworkConfig = getNetworkConfig();

	const client = new Lambda({ region: "us-east-1" });

	const networkConfig = NetworkConfig[NETWORK];

	const provider = new JsonRpcProvider(networkConfig.url);

	const TO = await provider.getBlockNumber();

	for (let _from = FROM; _from <= TO; _from += BATCH) {
		const eventTypes = _.values(EdnsEventType);
		for (const eventType of eventTypes) {
			let _to = _from + BATCH;

			console.log({ eventType, from: _from, to: _to });

			if (_to > TO) {
				await client.invokeAsync({
					FunctionName: "EDNS-Listener-Sync-Event",
					InvokeArgs: JSON.stringify({ chainId: networkConfig.chainId, from: _from, to: await provider.getBlockNumber(), eventType }),
				});
			} else {
				await client.invokeAsync({
					FunctionName: "EDNS-Listener-Sync-Event",
					InvokeArgs: JSON.stringify({ chainId: networkConfig.chainId, from: _from, to: _to, eventType }),
				});
			}
		}
	}
}

main()
	.then(() => {
		process.exit(0);
	})
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
