import { Request, Response, NextFunction } from "express";
import { EdnsService } from "../services/edns.service";
import { RedisService } from "../services/redis.service";
export default class EdnsController {
  public static async queryEdnsAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    let output;
    try {
      const { fqdn } = req.params;
      res.set("Function", "GetAddressUsingFqdn");
      if (req.query.redis) {
        // Call redis service
        res.set("On-Chain", "false");
        const redisService = new RedisService();
        output = await redisService.getValueUsingFqdn(fqdn, "address");
      } else {
        res.set("On-Chain", "true");
        // Call edns service (blockchain)
        const ednsService = new EdnsService();
        output = await ednsService.queryEdnsAddress(`${fqdn}`);
      }
      if (output.error) {
        throw output.error;
      }
      res.locals.result = output?.result;
      next();
      // console.log(result)
    } catch (error) {
      res.locals.result = output?.result;
      next(error);
    }
  }

  public static async queryEdnsNft(req: Request, res: Response, next: NextFunction): Promise<void> {
    let output;
    try {
      const { fqdn } = req.params;
      res.set("Function", "GetNftUsingFqdn");
      if (req.query.redis) {
        // Call redis service
        res.set("On-Chain", "false");
        const redisService = new RedisService();
        output = await redisService.getValueUsingFqdn(fqdn, "nft");
      } else {
        // Call edns service (blockchain)
        res.set("On-Chain", "true");
        const ednsService = new EdnsService();
        output = await ednsService.queryEdnsNft(`${fqdn}`);
      }
      if (output.error) {
        throw output.error;
      }
      res.locals.result = output?.result;
      next();
    } catch (error) {
      res.locals.result = output?.result;
      next(error);
    }
  }

  public static async queryEdnsText(req: Request, res: Response, next: NextFunction): Promise<void> {
    let output;
    try {
      const { fqdn } = req.params;
      res.set("Function", "GetTextUsingFqdn");
      if (req.query.redis) {
        // Call redis service
        res.set("On-Chain", "false");
        const redisService = new RedisService();
        output = await redisService.getValueUsingFqdn(fqdn, "text");
      } else {
        // Call edns service (blockchain)
        res.set("On-Chain", "true");
        const ednsService = new EdnsService();
        output = await ednsService.queryEdnsText(`${fqdn}`);
      }
      if (output.error) {
        throw output.error;
      }
      res.locals.result = output?.result;
      next();
    } catch (error) {
      res.locals.result = output?.result;
      next();
    }
  }

  public static async queryEdnsDomain(req: Request, res: Response, next: NextFunction): Promise<void> {
    let output;
    try {
      const { address } = req.params;
      res.set("Function", "GetDomainUsingAddress");
      if (req.query.redis) {
        // Call redis service
        res.set("On-Chain", "false");
        const redisService = new RedisService();
        output = await redisService.getDomainUsingAddress(address);
      } else {
        // Call edns service (blockchain)
        res.set("On-Chain", "true");
        const ednsService = new EdnsService();
        output = await ednsService.queryEdnsDomain(`${address}`);
      }
      if (output.error) {
        throw output.error;
      }
      res.locals.result = output?.result;
      next();
    } catch (error) {
      res.locals.result = output?.result;
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
      if (req.query.redis) {
        // Call redis service
        res.set("On-Chain", "false");
        const redisService = new RedisService();
        output = await redisService.getValueUsingFqdn(fqdn, "text", type);
      } else {
        // Call edns service (blockchain)
        res.set("On-Chain", "true");
        const ednsService = new EdnsService();
        output = await ednsService.queryEdnsTypeText(`${fqdn}`, `${type}`);
      }
      if (output.error) {
        throw output.error;
      }
      res.locals.result = output?.result;
      next();
    } catch (error) {
      res.locals.result = output?.result;
      next(error);
    }
  }
}
