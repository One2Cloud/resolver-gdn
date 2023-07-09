import { IRegistry__factory, PublicResolver, PublicResolver__factory, Registrar__factory, PublicResolver__factory as ResolverFactory } from "../../typechain";
import ContractAddress from "../../static/edns/contracts.json";
import NetworkConfig, { Net } from "../network-config";
import * as luxon from "luxon";
import { Registrar } from "../../../listener/src/contracts/ethereum/typechain/Registrar";
import { Registry } from "../../../listener/src/contracts/ethereum/typechain/Registry";
import { getProvider } from "../utils/get-provider";
import { createRedisClient } from "../utils/create-redis-client";
import { isValidFqdn } from "../utils/is-valid-fqdn";
import { extractFqdn } from "../utils/extract-fqdn";
import _ from "lodash";

export interface IOptions {
  chainId?: number;
  net?: Net;
  onChain: string;
}

export interface IGetAddressRecordOutput {
  address: string;
}
export interface IGetMultiCoinAddressRecordOutput {
  coin: string;
  address: string;
}
export interface IGetTextRecordOutput {
  text: string;
}
export interface IGetTypedTextRecordOutput {
  typed: string;
  text: string;
}

export interface IGetNftRecordOutput {
  chainId: string;
  contractAddress: string;
  tokenId: string;
}

export interface IGetDomainOutput {
  chain: number;
  owner: string;
  expiry: luxon.DateTime;
  resolver: string;
  operators: string[];
  user: {
    address: string;
    expiry: luxon.DateTime;
  };
  hosts: string[];
}

export interface IGetHostOutput {
  operators: string[];
  user: {
    address: string;
    expiry: luxon.DateTime;
  };
  records: string[];
}

export interface IEdnsResolverService {
  getAddressRecord(fqdn: string, options?: IOptions): Promise<IGetAddressRecordOutput | undefined>;
  getMultiCoinAddressRecord(fqdn: string, coin: string, options?: IOptions): Promise<IGetMultiCoinAddressRecordOutput | undefined>;
  getTextRecord(fqdn: string, options?: IOptions): Promise<IGetTextRecordOutput | undefined>;
  getTypedTextRecord(fqdn: string, typed: string, options?: IOptions): Promise<IGetTypedTextRecordOutput | undefined>;
  getNftRecord(fqdn: string, chainId: string, options?: IOptions): Promise<IGetNftRecordOutput | undefined>;
  // getAllRecords(fqdn: string): Promise<IGetAddressRecordOutput[] | undefined>;
}

export interface IEdnsRegistryService {
  getDomain(fqdn: string, options?: IOptions): Promise<IGetDomainOutput | undefined>;
  getDomainsByAccount(account: string, options?: IOptions): Promise<IGetDomainOutput[] | undefined>;
  getHost(fqdn: string, options?: IOptions): Promise<IGetHostOutput | undefined>;
  // getHostsByDomain(fqdn: string, options?: IOptions): Promise<IGetHostOutput[] | undefined>;
  // getRecordsByHost(fqdn: string, options?: IOptions): Promise<string[] | undefined>;
}

const getContracts = (chainId: number): { registrar: Registrar; Registry: Registry; Resolver: PublicResolver } => {
  const network = NetworkConfig[chainId];
  const contracts = ContractAddress.find((contract) => contract.chainId === network.chainId);
  if (contracts?.addresses["Registrar"] && contracts?.addresses["Registrar"] && contracts?.addresses["PublicResolver"]) {
    const provider = getProvider(network.chainId);
    return {
      registrar: Registrar__factory.connect(contracts.addresses["Registrar"], provider),
      Registry: IRegistry__factory.connect(contracts.addresses["Registry.Diamond"], provider),
      Resolver: PublicResolver__factory.connect(contracts.addresses["PublicResolver"], provider),
    };
  } else {
    throw new Error(""); // TODO:
  }
};

export class EdnsService implements IEdnsResolverService, IEdnsRegistryService {
  public async getAddressRecord(fqdn: string, options?: IOptions): Promise<IGetAddressRecordOutput | undefined> {
    const redis = createRedisClient();
    if (!isValidFqdn) throw new Error(""); //TODO:
    const address = await redis.hget(`edns:${options?.net || Net.MAINNET}:host:${fqdn}:records`, "address");
    if (!address) return undefined;
    return { address };
  }

  public async getMultiCoinAddressRecord(fqdn: string, coin: string, options?: IOptions): Promise<IGetMultiCoinAddressRecordOutput | undefined> {
    const redis = createRedisClient();
    if (!isValidFqdn) throw new Error(""); //TODO:
    const address = await redis.hget(`edns:${options?.net || Net.MAINNET}:host:${fqdn}:records`, `multi_coin_address:${coin}`);
    if (!address) return undefined;
    return { coin, address };
  }

  public async getTextRecord(fqdn: string, options?: IOptions): Promise<IGetTextRecordOutput | undefined> {
    const redis = createRedisClient();
    if (!isValidFqdn) throw new Error(""); //TODO:
    const text = await redis.hget(`edns:${options?.net || Net.MAINNET}:host:${fqdn}:records`, `text`);
    if (!text) return undefined;
    return { text };
  }

  public async getTypedTextRecord(fqdn: string, typed: string, options?: IOptions): Promise<IGetTypedTextRecordOutput | undefined> {
    const redis = createRedisClient();
    if (!isValidFqdn) throw new Error(""); //TODO:
    const text = await redis.hget(`edns:${options?.net || Net.MAINNET}:host:${fqdn}:records`, `typed_text:${typed}`);
    if (!text) return undefined;
    return { text, typed };
  }

  public async getNftRecord(fqdn: string, chainId: string, options?: IOptions): Promise<IGetNftRecordOutput | undefined> {
    const redis = createRedisClient();
    if (!isValidFqdn) throw new Error(""); //TODO:
    const result = await redis.hget(`edns:${options?.net || Net.MAINNET}:host:${fqdn}:records`, `text`);
    if (!result) return undefined;
    const [contractAddress, tokenId] = result.split(":");
    return { contractAddress, tokenId, chainId };
  }

  public async getDomain(fqdn: string, options?: IOptions): Promise<IGetDomainOutput | undefined> {
    const redis = createRedisClient();
    if (!isValidFqdn) throw new Error(""); //TODO:
    const { name, tld } = extractFqdn(fqdn);
    if (!name) throw new Error(""); //TODO:
    const _domain = `${name}.${tld}`;

    const results = await redis
      .pipeline()
      .hget(`edns:${options?.net || Net.MAINNET}:domain:${_domain}:info`, "owner")
      .hget(`edns:${options?.net || Net.MAINNET}:domain:${_domain}:info`, "expiry")
      .hget(`edns:${options?.net || Net.MAINNET}:domain:${_domain}:info`, "chain")
      .hget(`edns:${options?.net || Net.MAINNET}:domain:${_domain}:info`, "resolver")
      .hget(`edns:${options?.net || Net.MAINNET}:domain:${_domain}:user`, "user")
      .hget(`edns:${options?.net || Net.MAINNET}:domain:${_domain}:user`, "expiry")
      .smembers(`edns:${options?.net || Net.MAINNET}:domain:${_domain}:operators`)
      .smembers(`edns:${options?.net || Net.MAINNET}:domain:${_domain}:hosts`)
      .exec();

    if (!results) return undefined;

    return {
      owner: results[0][1] as string,
      expiry: luxon.DateTime.fromSeconds(parseInt(results[1][1] as string)),
      chain: parseInt(results[2][1] as string),
      resolver: results[3][1] as string,
      user: {
        address: results[4][1] as string,
        expiry: luxon.DateTime.fromSeconds(parseInt(results[5][1] as string)),
      },
      operators: results[6][1] as string[],
      hosts: results[7][1] as string[],
    };
  }

  public async getDomainsByAccount(account: string, options?: IOptions): Promise<IGetDomainOutput[]> {
    const redis = createRedisClient();
    const _domains_ = await redis.smembers(`edns:${options?.net || Net.MAINNET}:account:${account}:domains`);
    const domains = await Promise.all(_domains_.map((d) => this.getDomain(d, options)));
    return domains.filter((d) => !!d) as IGetDomainOutput[];
  }

  public async getHost(fqdn: string, options?: IOptions): Promise<IGetHostOutput | undefined> {
    const redis = createRedisClient();
    if (!isValidFqdn) throw new Error(""); //TODO:
    const results = await redis
      .pipeline()
      .hget(`edns:${options?.net || Net.MAINNET}:host:${fqdn}:user`, "user")
      .hget(`edns:${options?.net || Net.MAINNET}:host:${fqdn}:user`, "expiry")
      .smembers(`edns:${options?.net || Net.MAINNET}:hosts:${fqdn}:operators`)
      .smembers(`edns:${options?.net || Net.MAINNET}:hosts:${fqdn}:records:list`)
      .exec();

    if (!results) return undefined;

    return {
      user: {
        address: results[0][1] as string,
        expiry: luxon.DateTime.fromSeconds(parseInt(results[1][1] as string)),
      },
      operators: results[2][1] as string[],
      records: results[3][1] as string[],
    };
  }
}
