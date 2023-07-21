import { Request } from "express";
import { IOptions } from "../interfaces/IOptions.interface";
import { Net } from "../network-config";

export const extract = (req: Request): IOptions => {
  const options: IOptions = {};
  console.log({ query: req.query });

  options.onchain = req.query.onchain === "true";
  options.chainId = req.query.chain_id ? parseInt(req.query.chain_id as string, 10) : undefined;
  options.net = req.query.net ? <Net>req.query.net : undefined;
  options.version = req.query.version ? (req.query.version as string) : undefined;
  console.log("options: ", options);

  return options;
};
