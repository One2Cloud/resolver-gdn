import { Request, Response, NextFunction } from "express";
import { EdnsService } from "../services/edns.service";

import { EdnsV1FromContractService } from "../services/edns-v1.service";
import { IOptions } from "../interfaces/IOptions.interface";
import { InvalidQueryError } from "../errors/invalid-query.error";
import { Net, Network } from "../network-config";

function queryHandler(req: Request): IOptions {
  let options: IOptions = {};
  // Handle onChain
  if (req.query.redis === undefined) {
    options.onChain = undefined;
  } else if (req.query.redis === "true" || req.query.redis === "false") {
    options.onChain = req.query.redis === "false";
  } else {
    throw new InvalidQueryError({ redis: req.query.redis });
  }
  // Handle version
  if (req.query.version === undefined) {
    options.version = undefined;
  } else if (req.query.version === "v1" || req.query.version === "v2") {
    options.version = req.query.version;
  } else {
    throw new InvalidQueryError({ version: req.query.version });
  }
  // Handle net
  if (req.query.net === undefined) {
    options.net = undefined;
  } else if (req.query.net === "MAINNET" || req.query.net === "TESTNET") {
    options.net = Net[req.query.net];
  } else {
    throw new InvalidQueryError({ net: req.query.net });
  }
  // Handle chainId
  const validChainId = Object.values(Network).filter((value) => typeof value === "number");
  console.log(validChainId);
  if (req.query.chainId === undefined) {
    options.chainId = undefined;
  } else {
    const chainId = Number(req.query.chainId);
    // chainId will be NaN if req.query.chainId is not a number
    if (!Number.isNaN(chainId) && validChainId.includes(chainId)) {
      options.chainId = chainId;
    } else {
      throw new InvalidQueryError({ chainId: req.query.chainId });
    }
  }
  console.log(options);
  return options;
}

export default class EdnsController {
  // public static async queryEdnsAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   const v1Service = new EdnsV1FromContractService()
  //   output = await v1Service.queryEdnsAddress(fqdn)
  // }

  public static async queryEdnsAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    let output;
    try {
      const { fqdn } = req.params;
      const options = queryHandler(req);
      res.set("Function", "GetAddressUsingFqdn");
      res.set("On-Chain", String(options.onChain === undefined ? true : options.onChain));
      const ednsService = new EdnsService();
      output = await ednsService.getAddressRecord(`${fqdn}`, options);
      res.locals.result = output?.address;
      next();
    } catch (error) {
      res.locals.result = output?.address;
      next(error);
    }
  }

  public static async queryEdnsNft(req: Request, res: Response, next: NextFunction): Promise<void> {
    let output;
    try {
      const { fqdn, chainId } = req.params;
      const options = queryHandler(req);
      res.set("Function", "GetNftUsingFqdn");
      res.set("On-Chain", String(options.onChain === undefined ? true : options.onChain));
      const ednsService = new EdnsService();
      output = await ednsService.queryEdnsNft(`${fqdn}`, chainId, options);
      res.locals.result = output;
      next();
    } catch (error) {
      res.locals.result = output;
      next(error);
    }
  }

  public static async queryEdnsText(req: Request, res: Response, next: NextFunction): Promise<void> {
    let output;
    try {
      const { fqdn } = req.params;
      const options = queryHandler(req);
      res.set("Function", "GetTextUsingFqdn");
      res.set("On-Chain", String(options.onChain === undefined ? true : options.onChain));
      const ednsService = new EdnsService();
      output = await ednsService.queryEdnsText(`${fqdn}`, options);
      res.locals.result = output;
      next();
    } catch (error) {
      res.locals.result = output;
      next();
    }
  }

  public static async queryEdnsDomain(req: Request, res: Response, next: NextFunction): Promise<void> {
    let output;
    try {
      const { address } = req.params;
      const options = queryHandler(req);
      res.set("Function", "GetDomainUsingAddress");
      res.set("On-Chain", String(options.onChain === undefined ? true : options.onChain));
      const ednsService = new EdnsService();
      output = await ednsService.queryEdnsDomain(`${address}`, options);
      res.locals.result = output;
      next();
    } catch (error) {
      res.locals.result = output;
      next(error);
    }
  }

  // public static async queryEdnsMultiCoinAddress(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   try {
  //     const { fqdn, coin } = req.params;
  //     const ednsService = new EdnsService();
  //     const _coin = parseInt(coin);
  //     const result = await ednsService.queryEdnsMultiCoinAddress(
  //       `${fqdn}`,
  //       _coin
  //     );
  //     res.json(result);
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  public static async queryEdnsTypeText(req: Request, res: Response, next: NextFunction): Promise<void> {
    let output;
    try {
      const { fqdn, type } = req.params;
      const options = queryHandler(req);
      res.set("Function", "GetTypedTextUsingFqdn");
      res.set("On-Chain", String(options.onChain === undefined ? true : options.onChain));
      const ednsService = new EdnsService();
      output = await ednsService.queryEdnsTypeText(`${fqdn}`, type, options);
      res.locals.result = output;
      next();
    } catch (error) {
      res.locals.result = output;
      next(error);
    }
  }
}
