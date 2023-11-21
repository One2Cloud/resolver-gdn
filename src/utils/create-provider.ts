import { JsonRpcProvider, WebSocketProvider } from "@ethersproject/providers";
import { getNetworkConfig } from "../network-config";
export const createProvider = (chainId: number): JsonRpcProvider | WebSocketProvider => {
	const NetworkConfig = getNetworkConfig();
	let provider: JsonRpcProvider | WebSocketProvider | undefined = undefined;
	const network = NetworkConfig[chainId];
	if (network.url.startsWith("http")) {
		provider = new JsonRpcProvider(network.url, {
			name: network.name,
			chainId,
		});
	} else if (network.url.startsWith("ws")) {
		provider = new WebSocketProvider(network.url, {
			name: network.name,
			chainId,
		});
	}
	if (!provider) throw new Error(`Could not create provider for chainId ${chainId}`);
	return provider;
};
