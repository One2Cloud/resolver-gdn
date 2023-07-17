import { Request, Response, NextFunction } from "express";
import { EdnsService } from "../services/edns.service";
import { RedisService } from "../services/redis.service";

import { EdnsV1FromContractService } from "../services/edns-v1.service";

export default class EdnsController {
  // public static async queryEdnsAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   const v1Service = new EdnsV1FromContractService()
  //   output = await v1Service.queryEdnsAddress(fqdn)
  // }

  public static async queryEdnsAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    let output;
    try {
      const { fqdn } = req.params;
      res.set("Function", "GetAddressUsingFqdn");
      const ednsService = new EdnsService();
      res.set("On-Chain", `${req.query.redis}`);
      output = await ednsService.getAddressRecord(`${fqdn}`, { onChain: Boolean(req.query.redis) });
      res.locals.result = output?.address;
      next();
      // console.log(result)
    } catch (error) {
      res.locals.result = output?.address;
      next(error);
    }
  }

  public static async queryEdnsNft(req: Request, res: Response, next: NextFunction): Promise<void> {
    let output;
    try {
      const { fqdn, chainId } = req.params;
      res.set("Function", "GetNftUsingFqdn");
      const ednsService = new EdnsService();
      res.set("On-Chain", `${req.query.redis}`);
      output = await ednsService.queryEdnsNft(`${fqdn}`, chainId, { onChain: Boolean(req.query.redis), chainId: Number(chainId) });
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
      res.set("Function", "GetTextUsingFqdn");
      const ednsService = new EdnsService();
      res.set("On-Chain", `${req.query.redis}`);
      output = await ednsService.queryEdnsText(`${fqdn}`, { onChain: Boolean(req.query.redis) });
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
      res.set("Function", "GetDomainUsingAddress");
      const ednsService = new EdnsService();
      res.set("On-Chain", `${req.query.redis}`);
      output = await ednsService.queryEdnsDomain(`${address}`, { onChain: Boolean(req.query.redis) });
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
      res.set("Function", "GetTypedTextUsingFqdn");
      const ednsService = new EdnsService();
      res.set("On-Chain", `${req.query.redis}`);
      output = await ednsService.queryEdnsTypeText(`${fqdn}`, type, { onChain: Boolean(req.query.redis) });
      res.locals.result = output;
      next();
    } catch (error) {
      res.locals.result = output;
      next(error);
    }
  }
}
