import { Request } from "express";
import { IOptions } from "../interfaces/IOptions.interface";
import { Net } from "../network-config";

export const extract = (req: Request): IOptions => {
  const {
    onchain, // Default value for onchain
    chain_id,
    version = "v2", // Default value for version
    net = Net.MAINNET, // Default value for net
  } = req.query;

  // Convert chain_id to a number if it's not undefined
  const chainId = chain_id !== undefined ? Number(chain_id) : undefined;

  // Return an object of type IOptions
  return {
    chainId,
    net: net as Net,
    version: version as string,
    onchain: onchain === "true",
  };
};
