import {Resolver, Resolver__factory as ResolverFactory} from "../typechain/edns-v1/typechain";
import { getProvider } from "../utils/get-provider";
import { extractFqdn } from "../utils/extract-fqdn";
import NetworkConfig, { Net } from "../network-config";
import { isValidFqdn } from "../utils/is-valid-fqdn";
import { InvalidFqdnError } from '../errors/invalid-fqdn.error';
import { BigNumber, ethers } from "ethers";
import { DomainNotFoundError } from "../errors/domain-not-found.error";
import { formatsByName } from "@ensdomains/address-encoder";
import { RESOLVER_CONTRACT_ADDRESS, RPC_ENDPOINT } from "../useContract";
import { IOptions } from "../interfaces/IOptions.interface";
import { MissingCoinNameError } from "../errors/missing-coin-name.error";
import { namehash } from "../utils/namehash";
import { IEdnsResolverServiceV1, IGetMultiCoinAddressRecordOutput, IGetNftRecordOutput, IGetTextRecordOutput, IGetTypedTextRecordOutput } from "../interfaces/IEdnsResolverService.interface";
import { IEdnsRegistryServiceV1 } from "../interfaces/IEdnsRegistryService.interface";

export interface IGetAddressRecordOutput {
  address: string;
}

export class EdnsV1FromContractService implements IEdnsResolverServiceV1, IEdnsRegistryServiceV1 {

  public async getAddressRecord(domain: string, coinName: string): Promise<IGetAddressRecordOutput | undefined> {

    const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);
    const Resolver = ResolverFactory.connect(RESOLVER_CONTRACT_ADDRESS, provider);
    const hash = namehash(domain);
    const address_ = await Resolver.callStatic['addr(bytes32,uint256)'](hash, formatsByName[coinName].coinType);
    if (address_ !== '0x') {
        if (ethers.utils.isAddress(address_)) {
          return {address : address_};
        } else {
          return undefined; 
            // return formatsByName[coinName].encoder(Buffer.from(ethers.utils.toUtf8String(address_), 'hex'))
        }
    } else {
        return undefined;
    }
  }

  public async getMultiCoinAddressRecord(fqdn: string, coin: string, options?: IOptions): Promise<IGetMultiCoinAddressRecordOutput | undefined> {
    throw new Error("Method not implemented.");
  }

  public async getTextRecord(fqdn: string, options?: IOptions): Promise<IGetTextRecordOutput | undefined> {
    throw new Error("Method not implemented.");
  }

  public async getTypedTextRecord(fqdn: string, typed: string, options?: IOptions): Promise<IGetTypedTextRecordOutput | undefined> {
    throw new Error("Method not implemented.");
  }

  public async getNftRecord(fqdn: string, chainId: string, options?: IOptions): Promise<IGetNftRecordOutput | undefined> {
    throw new Error("Method not implemented.");
  }

  public async isExists(fqdn: string, options?: IOptions): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}