import EthereumNetworkConfig, { Mainnets as EthereumMainnets, Testnets as EthereumTestnets } from "./src/ethereum-network-config";
import EdnsContractsAddress from "./static/edns-contracts-address.json";
import EdnsEthereumListener from "./src/listeners/edns-ethereum.listener";
import { createLogger } from "./src/utils/create-logger";
import * as dotenv from "dotenv";

dotenv.config();
const logger = createLogger({ listener: "listener" });

const main = async () => {
	const _networks = process.env.MAINNET === "1" ? EthereumMainnets : EthereumTestnets;
	for (const _network of _networks) {
		const network = EthereumNetworkConfig[_network];
		const contracts = EdnsContractsAddress.find((contract) => contract.chainId === network.chainId);
		if (contracts?.addresses["Registrar"] && contracts?.addresses["Registrar"] && contracts?.addresses["PublicResolver"]) {
			const _listener = new EdnsEthereumListener({
				id: network.chainId,
				name: network.name,
				rpc: network.url,
				contracts: {
					registrar: contracts.addresses["Registrar"],
					registry: contracts.addresses["Registry.Diamond"],
					resolver: contracts.addresses["PublicResolver"],
					bridge: contracts.addresses["Bridge"],
				},
			});
			_listener.start();
		}
	}
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
