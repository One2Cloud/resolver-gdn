import { JsonRpcProvider } from "@ethersproject/providers";
import {  getNetworkConfig } from "../network-config";

export const getProvider = (chainId: number) => {
  const NetworkConfig = getNetworkConfig();
  const network = NetworkConfig[chainId];
  return new JsonRpcProvider(network.url, { name: network.name, chainId: network.chainId });
};
