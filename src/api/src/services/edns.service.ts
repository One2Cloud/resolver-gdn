import * as ethers from "ethers";
import { formatsByName } from "@ensdomains/address-encoder";
import { RESOLVER_CONTRACT_ADDRESS, RPC_ENDPOINT, CHAINID } from "../useContract";
import {
  PublicResolver,
  PublicResolver__factory as ResolverFactory,
} from "../../typechain";
import {
  BaseRegistrarController,
  BaseRegistrarController__factory as RegistrarFactory,
} from "../../typechain";
import { JsonRpcProvider } from "@ethersproject/providers";
import {
  LookupAddress,
  LookUpText,
  LookupDomainFromAddress,
  TextType,
} from "@edns/sdk";
import { isEnumMember } from "typescript";
import { errorTransform } from './errorTransform';
import { EdnsV1FromContractService } from './edns-v1.service';
import { EdnsV2FromContractService, EdnsV2FromRedisService } from './edns-v2.service';

const contractList: {[key: number]: {resolverAddress: string, rpcUrl: string}} = {
  43113: {
    resolverAddress: '0xa869',
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc'
  }
};

export interface IQueryOutput{
  result?: any;
  error?: Error;
}

export interface IOptions{
  on_chain?: boolean;
}

export class EdnsService {

  public async getAddressRecord(fqdn: string, options?: IOptions){

    const v2RedisService = new EdnsV2FromRedisService();
    const v2ContractService = new EdnsV2FromContractService();

    let address: string | undefined;

    if (options?.on_chain === undefined || options?.on_chain === true) {
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
      return {address}
    }
  }
}
