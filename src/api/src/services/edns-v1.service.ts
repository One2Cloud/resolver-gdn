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

export interface IGetAddressRecordOutput {
  address: string;
}

export interface IEdnsResolverService {
  getAddressRecord(fqdn: string, options?: IOptions): Promise<IGetAddressRecordOutput | undefined>;
  // getMultiCoinAddressRecord(fqdn: string, coin: string, options?: IOptions): Promise<IGetMultiCoinAddressRecordOutput | undefined>;
  // getTextRecord(fqdn: string, options?: IOptions): Promise<IGetTextRecordOutput | undefined>;
  // getTypedTextRecord(fqdn: string, typed: string, options?: IOptions): Promise<IGetTypedTextRecordOutput | undefined>;
  // getNftRecord(fqdn: string, chainId: string, options?: IOptions): Promise<IGetNftRecordOutput | undefined>;
  // getAllRecords(fqdn: string): Promise<IGetAddressRecordOutput[] | undefined>;
}

export interface IEdnsRegistryService {
  // isExists(fqdn: string, options?: IOptions): Promise<boolean>;
}

export const namehash = (domain: string): string => {
  const [name, tld] = domain.split('.');
  const basenode = ethers.utils.namehash(tld);
  const labelhash = ethers.utils.solidityKeccak256(['string', 'bytes32'], [name, basenode]);
  const nodehash = ethers.utils.solidityKeccak256(['bytes32', 'bytes32'], [basenode, labelhash]);
  return nodehash;
};

export class EdnsV1FromContractService implements IEdnsResolverService, IEdnsRegistryService {

  public async getAddressRecord(domain: string, options?: IOptions): Promise<IGetAddressRecordOutput | undefined> {

    const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);
    const Resolver = ResolverFactory.connect(RESOLVER_CONTRACT_ADDRESS, provider);
    const hash = namehash(domain);
    const address_ = await Resolver.callStatic['addr(bytes32,uint256)'](hash, formatsByName[options.coinName].coinType);
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
}