import { EdnsV1FromContractService, IGetAddressRecordOutput } from "./edns-v1.service";
import { EdnsV2FromContractService, EdnsV2FromRedisService } from "./edns-v2.service";
import { IOptions } from "../interfaces/IOptions.interface";
import { IGetDomainOutput, IGetNftRecordOutput, IGetTextRecordOutput, IGetTypedTextRecordOutput } from "../interfaces/IEdnsResolverService.interface";

export class EdnsService {
  public async queryEdnsNft(fqdn: string, chainId: string, options?: IOptions): Promise<IGetNftRecordOutput | undefined | Error> {
    const v2RedisService = new EdnsV2FromRedisService();
    const v2ContractService = new EdnsV2FromContractService();

    let nftresult;

    if (options?.onChain === undefined || options?.onChain === true) {
      const result = await v2ContractService.getNftRecord(fqdn, chainId, options);
      if (result) nftresult = result;
    } else {
      const result = await v2RedisService.getNftRecord(fqdn, chainId, options);
      if (result) nftresult = result;
    }

    if (!nftresult) {
      const v1ContractService = new EdnsV1FromContractService();
      const result = await v1ContractService.getNftRecord(fqdn, chainId, options);
      if (result) nftresult = result;
    }
    if (nftresult) {
      return nftresult;
    }
  }
  public async queryEdnsText(fqdn: string, options?: IOptions): Promise<IGetTextRecordOutput | undefined> {
    const v2RedisService = new EdnsV2FromRedisService();
    const v2ContractService = new EdnsV2FromContractService();

    let text: string | undefined;
    try {
      if (options?.onChain === undefined || options?.onChain === true) {
        const result = await v2RedisService.getTextRecord(fqdn, options);
        if (result) text = result.text;
      } else {
        const result = await v2ContractService.getTextRecord(fqdn, options);
        if (result) text = result.text;
      }

      if (!text) {
        const v1ContractService = new EdnsV1FromContractService();
        const result = await v1ContractService.getTextRecord(fqdn, options);
        if (result) text = result.text;
      }

      if (text) {
        return { text };
      }
    } catch (error: any) {
      return error;
    }
  }
  public async queryEdnsDomain(address: string, options?: IOptions): Promise<IGetDomainOutput | undefined> {
    const v2RedisService = new EdnsV2FromRedisService();
    const v2ContractService = new EdnsV2FromContractService();

    let domain: IGetDomainOutput | undefined;

    if (options?.onChain === undefined || options?.onChain === true) {
      const result = await v2RedisService.getDomain(address);
      if (result) domain = result;
    } else {
      const result = await v2ContractService.getDomain(address);
      if (result) domain = result;
    }

    if (!domain) {
      const v1ContractService = new EdnsV1FromContractService();
      const result = await v1ContractService.getDomain(address);
      if (result) domain = result;
    }

    if (domain) {
      return domain;
    }
  }
  public async queryEdnsTypeText(fqdn: string, typed: string, options?: IOptions): Promise<String | undefined> {
    const v2RedisService = new EdnsV2FromRedisService();
    const v2ContractService = new EdnsV2FromContractService();

    let typeText: string | undefined;

    if (options?.onChain === undefined || options?.onChain === true) {
      const result = await v2RedisService.getTypedTextRecord(fqdn, typed, options);
      if (result) typeText = result.text;
    } else {
      const result = await v2ContractService.getTypedTextRecord(fqdn, typed, options);
      if (result) typeText = result.text;
    }

    if (!typeText) {
      const v1ContractService = new EdnsV1FromContractService();
      const result = await v1ContractService.getTypedTextRecord(fqdn, typed, options);
      if (result) typeText = result.text;
    }

    if (typeText) {
      return typeText;
    }
  }
  
  public async getAddressRecord(fqdn: string, options?: IOptions): Promise<IGetAddressRecordOutput | undefined> {
    const v2RedisService = new EdnsV2FromRedisService();
    const v2ContractService = new EdnsV2FromContractService();

    let address: string | undefined;

    if (options?.onChain === undefined || options?.onChain === true) {
      const result = await v2ContractService.getAddressRecord(fqdn, options);
      if (result) address = result.address;
    } else {
      const result = await v2RedisService.getAddressRecord(fqdn, options);
      if (result) address = result.address;
    }

    if (!address) {
      const v1ContractService = new EdnsV1FromContractService();
      const result = await v1ContractService.getAddressRecord(fqdn, options);
      if (result) address = result.address;
    }

    if (address) {
      return { address };
    }
  }
}
