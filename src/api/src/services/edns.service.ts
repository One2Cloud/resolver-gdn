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
  public async queryEdnsNft(arg0: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  public async queryEdnsText(arg0: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  public async queryEdnsDomain(arg0: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  public async queryEdnsTypeText(arg0: string, arg1: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  public async getAddressRecord(fqdn: string, options?: IOptions) {
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
}
