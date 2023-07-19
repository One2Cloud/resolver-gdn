import Ethereumnetwork, { Mainnets as EthereumMainnets, Testnets as EthereumTestnets } from "../ethereum-network-config";

import { JsonRpcProvider, WebSocketProvider } from "@ethersproject/providers";
export const createProvider = (chainId: number): JsonRpcProvider | WebSocketProvider => {
	let provider: JsonRpcProvider | WebSocketProvider | undefined = undefined;
	const network = Ethereumnetwork[chainId];
	if (network.url.startsWith("http")) {
		provider = new JsonRpcProvider(network.url, { name: network.name, chainId });
	} else if (network.url.startsWith("ws")) {
		provider = new WebSocketProvider(network.url, { name: network.name, chainId });
	}
	if (!provider) throw new Error(`Could not create provider for chainId ${chainId}`);
	return provider;
};
