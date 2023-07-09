import { JsonRpcProvider } from "@ethersproject/providers";
import NetworkConfig, { Net } from "../network-config";

export const getProvider = (chainId: number) => {
  const network = NetworkConfig[chainId];
  return new JsonRpcProvider(network.url, { name: network.name, chainId: network.chainId });
};
