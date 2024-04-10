import { JsonRpcProvider } from "@ethersproject/providers";
import { getNetworkConfig } from "../network-config";

export const getProvider = async (chainId: number) => {
  const NetworkConfig = await getNetworkConfig();
  const network = NetworkConfig[chainId];
  return new JsonRpcProvider(network.url, {
    name: network.name,
    chainId: network.chainId,
  });
};
