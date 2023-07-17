import { EdnsV1FromContractService } from "./edns-v1.service";
import { EdnsV2FromContractService, EdnsV2FromRedisService } from "./edns-v2.service";
import { IOptions } from "../interfaces/IOptions.interface";

const contractList: { [key: number]: { resolverAddress: string; rpcUrl: string } } = {
  43113: {
    resolverAddress: "0xa869",
    rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
  },
};

export class EdnsService {
  public async queryEdnsNft(fqdn: string, chainId: string, options?: IOptions): Promise<any> {
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
      return { nftresult };
    }
  }
  public async queryEdnsText(fqdn: string, options?: IOptions) {
    const v2RedisService = new EdnsV2FromRedisService();
    const v2ContractService = new EdnsV2FromContractService();

    let text: string | undefined;

    if (options?.onChain === undefined || options?.onChain === true) {
      const result = await v2RedisService.getTextRecord(fqdn);
      if (result) text = result.text;
    } else {
      const result = await v2ContractService.getTextRecord(fqdn);
      if (result) text = result.text;
    }

    if (!text) {
      const v1ContractService = new EdnsV1FromContractService();
      const result = await v1ContractService.getTextRecord(fqdn);
      if (result) text = result.text;
    }

    if (text) {
      return { text };
    }
  }
  public async queryEdnsDomain(fqdn: string, options?: IOptions) {
    const v2RedisService = new EdnsV2FromRedisService();
    const v2ContractService = new EdnsV2FromContractService();

    let domain: string | undefined;

    if (options?.onChain === undefined || options?.onChain === true) {
      const result = await v2RedisService.getDomain(fqdn);
      if (result) domain = result.domain;
    } else {
      const result = await v2ContractService.getDomain(fqdn);
      if (result) domain = result.domain;
    }

    if (!domain) {
      const v1ContractService = new EdnsV1FromContractService();
      const result = await v1ContractService.getDomain(fqdn);
      if (result) domain = result.domain;
    }

    if (domain) {
      return { domain };
    }
  }
  public async queryEdnsTypeText(fqdn: string, options?: IOptions) {
    const v2RedisService = new EdnsV2FromRedisService();
    const v2ContractService = new EdnsV2FromContractService();

    let address: string | undefined;

    if (options?.onChain === undefined || options?.onChain === true) {
      const result = await v2RedisService.getAddressRecord(fqdn);
      if (result) address = result.address;
    } else {
      const result = await v2ContractService.getAddressRecord(fqdn);
      if (result) address = result.address;
    }

    if (!address) {
      const v1ContractService = new EdnsV1FromContractService();
      const result = await v1ContractService.getAddressRecord(fqdn);
      if (result) address = result.address;
    }

    if (address) {
      return { address };
    }
  }
  public async getAddressRecord(fqdn: string, options?: IOptions) {
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
