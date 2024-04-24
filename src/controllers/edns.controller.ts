import { Request, Response, NextFunction } from "express";
import { EdnsService } from "../services/edns.service";
import { extract } from "../utils/extract-options-from-request";
import { IGeneralResponse } from "../interfaces/IGeneralOutput.interface";
import { extractFqdn } from "../utils/extract-fqdn";
import { ZERO_ADDRESS } from "../network-config";
import { putSqsMessage } from "../utils/put-sqs-message";
import { EdnsEventType } from "../constants/event-type.constant";
import { DomainProvider } from "../constants/domain-provider.constant";
import { Mainnets as EdnsMainnets, Net } from "../network-config";
import { IDomainDetailsOutput, IGetWalletInfoOutput } from "../services/edns-v2/subgraph.interface";

const FQDN_REGEX = /\.$/;

export default class EdnsController {
  public static async getAllRecords(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { fqdn } = req.params;
      const options = extract(req);
      const service = new EdnsService();
      const output = await service.getAllRecords({ fqdn }, options);
      const response: IGeneralResponse<typeof output> = {
        status: 200,
        success: true,
        data: output,
        onchain: !!options.onchain,
        empty: false,
      };
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async getUrlRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { fqdn } = req.params;
      const options = {
        net: req.query.net || Net.MAINNET,
        onchain: req.query.onchain || "true",
      };
      const service = new EdnsService();
      const output = await service.getUrlRecord(fqdn);
      const response: IGeneralResponse<typeof output> = {
        status: 200,
        success: true,
        data: output,
        onchain: !!options.onchain,
        empty: false,
      };

      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async getReverseAddressRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { address } = req.params;
      const options = extract(req);
      const service = new EdnsService();
      console.log(options);

      const output = await service.getReverseAddressRecord({ address }, options);
      const response: IGeneralResponse<typeof output> = {
        status: 200,
        success: true,
        data: output,
        onchain: !!options.onchain,
        empty: !output?.fqdn,
      };

      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async getAddressRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let { fqdn } = req.params;
      if (fqdn.match(FQDN_REGEX)) fqdn = fqdn.slice(0, fqdn.length - 1);
      const options = extract(req);
      const service = new EdnsService();
      const [output, ttl] = await Promise.all([service.getAddressRecord({ fqdn }, options), service.getTtl(fqdn, options)]);
      const response: IGeneralResponse<typeof output> = {
        status: 200,
        success: true,
        data: { address: output?.address || ZERO_ADDRESS },
        onchain: !!options.onchain,
        empty: !(output?.address === ZERO_ADDRESS),
      };
      res.setHeader("Cache-Control", `public, max-age=${ttl || 600}`);
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async getMultiCoinAddressRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let { fqdn, coin } = req.params;
      if (fqdn.match(FQDN_REGEX)) fqdn = fqdn.slice(0, fqdn.length - 1);
      const options = extract(req);
      const service = new EdnsService();
      const [output, ttl] = await Promise.all([service.getMultiCoinAddressRecord({ fqdn, coin }, options), service.getTtl(fqdn, options)]);
      const response: IGeneralResponse<typeof output> = {
        status: 200,
        success: true,
        data: {
          coin,
          address: output?.address || ZERO_ADDRESS,
        },
        onchain: !!options.onchain,
        empty: !(output?.address === ZERO_ADDRESS),
      };
      res.setHeader("Cache-Control", `public, max-age=${ttl || 600}`);
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async getTextRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let { fqdn } = req.params;
      if (fqdn.match(FQDN_REGEX)) fqdn = fqdn.slice(0, fqdn.length - 1);
      const options = extract(req);
      const service = new EdnsService();
      const [output, ttl] = await Promise.all([service.getTextRecord({ fqdn }, options), service.getTtl(fqdn, options)]);
      const response: IGeneralResponse<typeof output> = {
        status: 200,
        success: true,
        data: { text: output?.text || undefined },
        onchain: !!options.onchain,
        empty: !output?.text,
      };
      res.setHeader("Cache-Control", `public, max-age=${ttl || 600}`);
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async getTypedTextRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let { fqdn, typed } = req.params;
      if (fqdn.match(FQDN_REGEX)) fqdn = fqdn.slice(0, fqdn.length - 1);
      const options = extract(req);
      console.log("controller", options);

      const service = new EdnsService();
      const output = await service.getTypedTextRecord({ fqdn, typed }, options);
      const response: IGeneralResponse<typeof output> = {
        status: 200,
        success: true,
        data: { typed, text: output?.text || undefined },
        onchain: !!options.onchain,
        empty: !output?.text,
      };
      res.setHeader("Cache-Control", `public, max-age=${600}`);
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async getNftRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let { fqdn, chainId } = req.params;
      if (fqdn.match(FQDN_REGEX)) fqdn = fqdn.slice(0, fqdn.length - 1);
      const options = extract(req);
      const service = new EdnsService();
      const [output, ttl] = await Promise.all([service.getNftRecord({ fqdn, chainId }, options), service.getTtl(fqdn, options)]);
      const response: IGeneralResponse<typeof output> = {
        status: 200,
        success: true,
        data: { chainId, contractAddress: output?.contractAddress || ZERO_ADDRESS, tokenId: output?.tokenId || "0" },
        onchain: !!options.onchain,
        empty: !(output?.tokenId === "0"),
      };
      res.setHeader("Cache-Control", `public, max-age=${ttl || 600}`);
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async getDomain(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let { fqdn } = req.params;
      if (fqdn.match(FQDN_REGEX)) fqdn = fqdn.slice(0, fqdn.length - 1);
      const options = extract(req);
      const service = new EdnsService();
      const [output, ttl] = await Promise.all([service.getDomain(fqdn, options), service.getTtl(fqdn, options)]);

      const response: IGeneralResponse<typeof output> = {
        status: 200,
        success: true,
        data: output,
        onchain: !!options.onchain,
        empty: !output?.owner,
      };
      // res.setHeader("Cache-Control", `public, max-age=${ttl || 600}`);
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async getOwner(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let { fqdn } = req.params;
      if (fqdn.match(FQDN_REGEX)) fqdn = fqdn.slice(0, fqdn.length - 1);
      const options = extract(req);
      const service = new EdnsService();
      const [output, ttl] = await Promise.all([service.getOwner(fqdn, options), service.getTtl(fqdn, options)]);
      const response: IGeneralResponse<typeof output> = {
        status: 200,
        success: true,
        data: output,
        onchain: !!options.onchain,
        empty: !output,
      };
      res.setHeader("Cache-Control", `public, max-age=${ttl || 600}`);
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async getExpiry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let { fqdn } = req.params;
      if (fqdn.match(FQDN_REGEX)) fqdn = fqdn.slice(0, fqdn.length - 1);
      const options = extract(req);
      const service = new EdnsService();
      const [output, ttl] = await Promise.all([service.getExpiry(fqdn, options), service.getTtl(fqdn, options)]);
      const response: IGeneralResponse<typeof output> = {
        status: 200,
        success: true,
        data: output,
        onchain: !!options.onchain,
        empty: output === undefined,
      };
      res.setHeader("Cache-Control", `public, max-age=${ttl || 600}`);
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async getDomainsByAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let { account } = req.params;
      const options = extract(req);
      const service = new EdnsService();
      const output = await service.getDomainsByAccount(account, options);
      const response: IGeneralResponse<typeof output> = {
        status: 200,
        success: true,
        data: output,
        onchain: !!options.onchain,
        empty: output == undefined || output.length === 0,
      };
      res.setHeader("Cache-Control", `public, max-age=${600}`);
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async getHost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let { fqdn } = req.params;
      if (fqdn.match(FQDN_REGEX)) fqdn = fqdn.slice(0, fqdn.length - 1);
      const options = extract(req);
      const service = new EdnsService();
      const [output, ttl] = await Promise.all([service.getHost(fqdn, options), service.getTtl(fqdn, options)]);
      const response: IGeneralResponse<typeof output> = {
        status: 200,
        success: true,
        data: output,
        onchain: !!options.onchain,
        empty: !output?.user,
      };
      res.setHeader("Cache-Control", `public, max-age=${ttl || 600}`);
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async getMultiCoinAddressList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let { fqdn } = req.params;
      if (fqdn.match(FQDN_REGEX)) fqdn = fqdn.slice(0, fqdn.length - 1);
      const options = extract(req);
      const service = new EdnsService();
      const [output, ttl] = await Promise.all([service.getMultiCoinAddressList(fqdn, options), service.getTtl(fqdn, options)]);
      const response: IGeneralResponse<typeof output> = {
        status: 200,
        success: true,
        data: output,
        onchain: !!options.onchain,
        empty: !output?.records_list,
      };
      res.setHeader("Cache-Control", `public, max-age=${ttl || 600}`);
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async getTypedTextList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let { fqdn } = req.params;
      if (fqdn.match(FQDN_REGEX)) fqdn = fqdn.slice(0, fqdn.length - 1);
      const options = extract(req);
      const service = new EdnsService();
      const [output, ttl] = await Promise.all([service.getTypedTextList(fqdn, options), service.getTtl(fqdn, options)]);
      const response: IGeneralResponse<typeof output> = {
        status: 200,
        success: true,
        data: output,
        onchain: !!options.onchain,
        empty: !output?.records_list,
      };
      res.setHeader("Cache-Control", `public, max-age=${ttl || 600}`);
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async getByPodname(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let { podname } = req.params;
      const options = extract(req);
      const service = new EdnsService();
      console.log("reach controller");

      const output = await service.getUrlByPodName(podname, options);
      const response: IGeneralResponse<typeof output> = {
        status: 200,
        success: true,
        data: output,
        onchain: !!options.onchain,
        empty: !!output,
      };
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async revalidate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let { fqdn } = req.params;
      if (fqdn.match(FQDN_REGEX)) fqdn = fqdn.slice(0, fqdn.length - 1);
      const options = extract(req);
      if (!options.chainId) throw new Error("`chain_id` in query parameter is required");
      const { host, name, tld } = extractFqdn(fqdn);
      await putSqsMessage({
        eventType: EdnsEventType.REVALIDATE,
        provider: DomainProvider.EDNS,
        chainId: options.chainId,
        fqdn,
        data: { host: host || "@", name, tld, chainId: options.chainId },
        net: EdnsMainnets.includes(options.chainId) ? Net.MAINNET : Net.TESTNET,
      });
      const response: IGeneralResponse<undefined> = {
        status: 200,
        success: true,
        onchain: false,
        empty: false,
      };
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async getWalletInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let { address } = req.params;
      const service = new EdnsService();
      const options = extract(req);
      const output = await service.getWalletInfo(address, options);
      const response: IGeneralResponse<IGetWalletInfoOutput> = {
        status: 200,
        success: true,
        onchain: false,
        data: output,
        empty: false,
      };
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async getDomainDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let { fqdn } = req.params;
      const service = new EdnsService();

      const output = await service.getDomainDetails(fqdn);
      const response: IGeneralResponse<IDomainDetailsOutput> = {
        status: 200,
        success: true,
        onchain: false,
        data: output,
        empty: false,
      };
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  }
}
