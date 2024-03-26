import ContractAddress from "../static/edns-contracts-address.json";
import { getNetworkConfig, Net } from "../network-config";
import * as luxon from "luxon";
import { getProvider } from "../utils/get-provider";
import { createRedisClient } from "../utils/create-redis-client";
import { isValidFqdn } from "../utils/is-valid-fqdn";
import { extractFqdn } from "../utils/extract-fqdn";
import _ from "lodash";
import { BigNumber, ethers } from "ethers";
import { InvalidFqdnError } from "../errors/invalid-fqdn.error";
import { DomainNotFoundError } from "../errors/domain-not-found.error";
import {
  IGetMultiCoinAddressRecordOutput,
  IGetTextRecordOutput,
  IGetTypedTextRecordOutput,
  IGetNftRecordOutput,
  IGetAddressRecordOutput,
  IEdnsResolverService,
  IGetAddressRecordInput,
  IGetMultiCoinAddressListOutput,
  IGetMultiCoinAddressRecordInput,
  IGetTypedTextRecordInput,
  IGetNftRecordInput,
  IGetTextRecordInput,
  IGetReverseAddressRecordInput,
  IGetReverseAddressRecordOutput,
  IGetBridgedEventInput,
  IGetTypedTextListOutput,
  IGetAllRecordsInput,
  IGetAllRecordsOutput,
  IGetUrlRecordOutput,
} from "../interfaces/IEdnsResolverService.interface";
import { Registrar, IRegistry, PublicResolver, Registrar__factory, IRegistry__factory, PublicResolver__factory } from "../contracts/ethereum/edns-v2/typechain";
import { IOptions } from "../interfaces/IOptions.interface";
import { IEdnsRegistryService, IGetDomainOutput, IGetDomainOutputSubgraph, IGetHostOutput } from "../interfaces/IEdnsRegistryService.interface";
import { CantConnectContractError } from "../errors/cant-connect-contract.error";
import { CantGetDomainNameError } from "../errors/cant-get-domain-name.error";
import { CantGetChainIdError } from "../errors/cant-get-chain-id.error";
import { MissingChainIdError } from "../errors/missing-chain-id.error";
import { timeIsPassed } from "../utils/time-is-passed";
import { DomainExpiredError } from "../errors/domain-expired.error";
import { getChainId } from "../utils/get-chain-id";
import { ZERO_ADDRESS } from "../network-config";
import { Key } from "../app/listener/handler";
import { url } from "inspector";
import { createClient, cacheExchange, fetchExchange } from "urql";
import config from "../config";

const getContracts = (chainId: number): { Registrar: Registrar; Registry: IRegistry; Resolver: PublicResolver } => {
  const NetworkConfig = getNetworkConfig();

  const network = NetworkConfig[chainId];
  const contracts = ContractAddress.find((contract) => contract.chainId === network.chainId);
  if (contracts?.addresses["Registrar"] && contracts?.addresses["Registry.Diamond"] && contracts?.addresses["PublicResolver"]) {
    try {
      const provider = getProvider(network.chainId);
      const RegistrarContract = Registrar__factory.connect(contracts.addresses["Registrar"], provider);
      const ResolverContract = PublicResolver__factory.connect(contracts.addresses["PublicResolver"], provider);
      const RegistryContract = IRegistry__factory.connect(contracts.addresses["Registry.Diamond"], provider);
      return {
        Registrar: RegistrarContract,
        Registry: RegistryContract,
        Resolver: ResolverContract,
      };
    } catch (error) {
      console.error({ error });
      throw new CantConnectContractError(chainId);
    }
  } else {
    throw new CantConnectContractError(chainId);
  }
};

export class EdnsV2FromRedisService implements IEdnsResolverService, IEdnsRegistryService {
  public async getAllRecords(input: IGetAllRecordsInput, options?: IOptions | undefined): Promise<IGetAllRecordsOutput | undefined> {
    const redis = createRedisClient();
    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);
    if (!(await this.isExists(input.fqdn, options))) return undefined;
    if (await this.isExpired(input.fqdn, options)) throw new DomainExpiredError(input.fqdn);

    const { host = "@", name, tld } = extractFqdn(input.fqdn);
    const net = options?.net || Net.MAINNET;

    const _host_ = await this.getHost(`${host}.${name}.${tld}`);
    if (!_host_) return undefined;

    const redisKey = Key.HOST_RECORDS_$HASH(net, `${host}.${name}.${tld}`, _host_.user?.address || ZERO_ADDRESS);

    const address = (await redis.hget(redisKey, "address")) || ZERO_ADDRESS;
    const text = (await redis.hget(redisKey, `text`)) || undefined;
    const recordList = await redis.hgetall(redisKey);
    const typedTexts = Object.keys(recordList)
      .filter((key) => key.startsWith("typed_text:"))
      .reduce((acc, val) => {
        return { ...acc, [val.split(":")[1]]: recordList[val] };
      }, {});
    const typedAddresses = Object.keys(recordList)
      .filter((key) => key.startsWith("multi_coin_address:"))
      .reduce((acc, val) => {
        return { ...acc, [val.split(":")[1]]: recordList[val] };
      }, {});
    return {
      fqdn: input.fqdn,
      address,
      text,
      typedTexts,
      typedAddresses,
    };
  }

  public async getUrlRecord(fqdn: string, options?: IOptions | undefined): Promise<IGetUrlRecordOutput | undefined> {
    const redis = createRedisClient();
    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);

    const { host = "@", name, tld } = extractFqdn(fqdn);
    const net = options?.net || Net.MAINNET;

    const _host_ = await this.getHost(`${host}.${name}.${tld}`);
    if (!_host_) return undefined;
    const user = (await redis.hget(Key.HOST_USER_$HASH(net, `${host}.${name}.${tld}`), "user")) || undefined;
    if (user) {
      const text = (await redis.hget(Key.HOST_RECORDS_$HASH(net, `${host}.${name}.${tld}`, user), `typed_text:url`)) || undefined;
      return { text };
    } else {
      return undefined;
    }
  }

  public async getBridgedEvent(input: IGetBridgedEventInput, options?: IOptions): Promise<string | undefined> {
    const redis = createRedisClient();
    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);
    if (!(await this.isExists(input.fqdn, options))) undefined;
    if (!(await this.isExists(input.fqdn, options))) return undefined;
    if (await this.isExpired(input.fqdn, options)) throw new DomainExpiredError(input.fqdn);
    let owner: string | null;
    let content;
    const { host, name, tld } = extractFqdn(input.fqdn);
    if (name && tld) {
      owner = await redis.hget(Key.DOMAIN_INFO_$HASH(options?.net || Net.MAINNET, `${name}.${tld}`), "owner");
      content = await redis.get(Key.ACCOUNT_BRIDGE_REQUESTED_$SET(options?.net || Net.MAINNET, owner || ZERO_ADDRESS));
    }
    if (!content) return undefined;
    return content;
  }

  public async getReverseAddressRecord(input: IGetReverseAddressRecordInput, options?: IOptions): Promise<IGetReverseAddressRecordOutput | undefined> {
    const redis = createRedisClient();

    const fqdn = await redis.get(Key.ACCOUNT_BRIDGE_REQUESTED_$SET(options?.net || Net.MAINNET, input.address));
    if (!fqdn) return undefined;
    return { fqdn };
  }

  public async getAddressRecord(input: IGetAddressRecordInput, options?: IOptions): Promise<IGetAddressRecordOutput | undefined> {
    const redis = createRedisClient();
    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);
    if (!(await this.isExists(input.fqdn, options))) return undefined;
    if (await this.isExpired(input.fqdn, options)) throw new DomainExpiredError(input.fqdn);

    const { host = "@", name, tld } = extractFqdn(input.fqdn);
    let address: string | undefined = undefined;
    const user = await redis.hget(Key.HOST_USER_$HASH(options?.net || Net.MAINNET, `${host}.${name}.${tld}`), "user");
    if (!user) return undefined;
    if (host && name && tld) {
      address = (await redis.hget(Key.HOST_RECORDS_$HASH(options?.net || Net.MAINNET, `${host}.${name}.${tld}`, user), "address")) || undefined;
    }
    if (!address) return { address: ZERO_ADDRESS };
    return { address };
  }

  public async getMultiCoinAddressRecord(input: IGetMultiCoinAddressRecordInput, options?: IOptions): Promise<IGetMultiCoinAddressRecordOutput | undefined> {
    const redis = createRedisClient();
    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);
    if (!(await this.isExists(input.fqdn, options))) return undefined;
    if (await this.isExpired(input.fqdn, options)) throw new DomainExpiredError(input.fqdn);

    const { host = "@", name, tld } = extractFqdn(input.fqdn);
    let address: string | undefined = undefined;
    const user = await redis.hget(Key.HOST_USER_$HASH(options?.net || Net.MAINNET, `${host}.${name}.${tld}`), "user");
    if (!user) return undefined;
    if (host && name && tld) {
      address = (await redis.hget(Key.HOST_RECORDS_$HASH(options?.net || Net.MAINNET, `${host}.${name}.${tld}`, user), `multi_coin_address:${input.coin}`)) || undefined;
    }
    if (!address) return { coin: input.coin, address: ZERO_ADDRESS };
    return { coin: input.coin, address };
  }

  public async getTextRecord(input: IGetTextRecordInput, options?: IOptions): Promise<IGetTextRecordOutput | undefined> {
    const redis = createRedisClient();
    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);
    if (!(await this.isExists(input.fqdn, options))) return undefined;
    if (await this.isExpired(input.fqdn, options)) throw new DomainExpiredError(input.fqdn);

    const { host = "@", name, tld } = extractFqdn(input.fqdn);
    let text: string | undefined = undefined;
    const user = await redis.hget(Key.HOST_USER_$HASH(options?.net || Net.MAINNET, `${host}.${name}.${tld}`), "user");
    if (!user) return undefined;
    if (host && name && tld) {
      text = (await redis.hget(Key.HOST_RECORDS_$HASH(options?.net || Net.MAINNET, `${host}.${name}.${tld}`, user), `text`)) || undefined;
    }
    if (!text) return { text: undefined };
    return { text };
  }

  public async getTypedTextRecord(input: IGetTypedTextRecordInput, options?: IOptions): Promise<IGetTypedTextRecordOutput | undefined> {
    const redis = createRedisClient();
    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);
    if (!(await this.isExists(input.fqdn, options))) return undefined;
    if (await this.isExpired(input.fqdn, options)) throw new DomainExpiredError(input.fqdn);

    const { host = "@", name, tld } = extractFqdn(input.fqdn);
    let text: string | undefined = undefined;
    const user = await redis.hget(Key.HOST_USER_$HASH(options?.net || Net.MAINNET, `${host}.${name}.${tld}`), "user");
    if (!user) return undefined;
    if (host && name && tld) {
      text = (await redis.hget(Key.HOST_RECORDS_$HASH(options?.net || Net.MAINNET, `${host}.${name}.${tld}`, user), `typed_text:${input.typed}`)) || undefined;
    }

    if (!text) return { text: undefined, typed: input.typed };
    return { text, typed: input.typed };
  }

  public async getNftRecord(input: IGetNftRecordInput, options?: IOptions): Promise<IGetNftRecordOutput | undefined> {
    const redis = createRedisClient();
    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);
    if (!(await this.isExists(input.fqdn, options))) return undefined;
    if (await this.isExpired(input.fqdn, options)) throw new DomainExpiredError(input.fqdn);

    const { host = "@", name, tld } = extractFqdn(input.fqdn);

    let result: string | undefined = undefined;
    const user = await redis.hget(Key.HOST_USER_$HASH(options?.net || Net.MAINNET, `${host}.${name}.${tld}`), "user");
    if (!user) return undefined;
    if (host && name && tld) {
      result = (await redis.hget(Key.HOST_RECORDS_$HASH(options?.net || Net.MAINNET, `${host}.${name}.${tld}`, user), `nft:${input.chainId}`)) || undefined;
    }
    if (!result)
      return {
        chainId: input.chainId,
        contractAddress: ZERO_ADDRESS,
        tokenId: "0",
      };
    const [contractAddress, tokenId] = result.split(":");
    return { contractAddress, tokenId, chainId: input.chainId };
  }

  public async isExists(fqdn: string, options?: IOptions): Promise<boolean> {
    const redis = createRedisClient();

    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);

    const { host, name, tld } = extractFqdn(fqdn);
    if (host && name && tld) {
      const hosts = await redis.smembers(Key.DOMAIN_HOSTS_$SET(options?.net || Net.MAINNET, `${name}.${tld}`));
      return !!hosts.includes(host);
    } else if (name && tld) {
      return !!(await redis.exists(Key.DOMAIN_INFO_$HASH(options?.net || Net.MAINNET, `${name}.${tld}`)));
    } else {
      return false;
    }
  }

  public async isExpired(fqdn: string, options?: IOptions): Promise<boolean> {
    const redis = createRedisClient();
    let time;
    const { host, name, tld } = extractFqdn(fqdn);
    if (name && tld) {
      time = +(await redis.hget(Key.DOMAIN_INFO_$HASH(options?.net || Net.MAINNET, `${name}.${tld}`), "expiry"))!;
    } else {
      time = 0; // TODO:
    }
    return timeIsPassed(time);
  }

  public async getDomain(fqdn: string, options?: IOptions): Promise<IGetDomainOutput | undefined> {
    const redis = createRedisClient();

    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);
    if (!(await this.isExists(fqdn, options))) return undefined;

    const { name, tld } = extractFqdn(fqdn);
    if (!name) throw new CantGetDomainNameError(fqdn);
    const _domain = `${name}.${tld}`;

    const results = await redis
      .pipeline()
      .hget(Key.DOMAIN_INFO_$HASH(options?.net || Net.MAINNET, _domain), "owner")
      .hget(Key.DOMAIN_INFO_$HASH(options?.net || Net.MAINNET, _domain), "expiry")
      .hget(Key.DOMAIN_INFO_$HASH(options?.net || Net.MAINNET, _domain), "chain")
      .hget(Key.DOMAIN_INFO_$HASH(options?.net || Net.MAINNET, _domain), "resolver")
      .hget(Key.DOMAIN_INFO_$HASH(options?.net || Net.MAINNET, _domain), "bridging")
      .hget(Key.DOMAIN_USER_$HASH(options?.net || Net.MAINNET, _domain), "user")
      .hget(Key.DOMAIN_USER_$HASH(options?.net || Net.MAINNET, _domain), "expiry")
      .smembers(Key.DOMAIN_OPERATORS_$SET(options?.net || Net.MAINNET, _domain))
      .smembers(Key.DOMAIN_HOSTS_$SET(options?.net || Net.MAINNET, _domain))
      .exec();

    if (!results) return undefined;

    return {
      owner: results[0][1] as string,
      expiry: luxon.DateTime.fromMillis(parseInt(results[1][1] as string)),
      chain: await getChainId(options?.net || Net.MAINNET, parseInt(results[2][1] as string)),
      resolver: results[3][1] as string,
      bridging: (results[4][1] as string) === "1",
      user: {
        address: results[5][1] as string,
        expiry: luxon.DateTime.fromMillis(parseInt(results[6][1] as string)),
      },
      operators: results[7][1] as string[],
      hosts: results[8][1] as string[],
    };
  }

  public async getOwner(fqdn: string, options?: IOptions): Promise<string | undefined> {
    const redis = createRedisClient();
    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);
    if (!(await this.isExists(fqdn, options))) return undefined;
    const { name, tld } = extractFqdn(fqdn);
    if (!name) throw new CantGetDomainNameError(fqdn);
    const _domain = `${name}.${tld}`;
    const owner = await redis.hget(Key.DOMAIN_INFO_$HASH(options?.net || Net.MAINNET, _domain), "owner");
    if (!owner) return undefined;
    return owner;
  }

  public async getExpiry(fqdn: string, options?: IOptions): Promise<number | undefined> {
    const redis = createRedisClient();
    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);
    if (!(await this.isExists(fqdn, options))) return undefined;
    const { name, tld } = extractFqdn(fqdn);
    if (!name) throw new CantGetDomainNameError(fqdn);
    const _domain = `${name}.${tld}`;
    const expiry = await redis.hget(Key.DOMAIN_INFO_$HASH(options?.net || Net.MAINNET, _domain), "expiry");
    if (!expiry) return undefined;
    return parseInt(expiry, 10);
  }

  public async getDomainsByAccount(account: string, options?: IOptions): Promise<IGetDomainOutput[]> {
    const redis = createRedisClient();
    const _domains_ = await redis.smembers(Key.ACCOUNT_DOMAINS_$SET(options?.net || Net.MAINNET, account));
    const domains = await Promise.all(_domains_.map((d) => this.getDomain(d, options)));
    return domains.filter((d) => !!d) as IGetDomainOutput[]; //TO-DO: empty result is {} instead of undefined
  }

  public async getHost(fqdn: string, options?: IOptions): Promise<IGetHostOutput | undefined> {
    const redis = createRedisClient();
    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);
    if (!(await this.isExists(fqdn, options))) undefined;
    let { host = "@", name, tld } = extractFqdn(fqdn);
    if (!name) throw new CantGetDomainNameError(fqdn);
    let fqdn_: string = `${host}.${name}.${tld}`;

    const user = await redis.hget(Key.HOST_USER_$HASH(options?.net || Net.MAINNET, `${host}.${name}.${tld}`), "user");
    if (!user) return undefined;

    const results = await redis
      .pipeline()
      .hget(Key.HOST_USER_$HASH(options?.net || Net.MAINNET, fqdn_), "user")
      .hget(Key.HOST_USER_$HASH(options?.net || Net.MAINNET, fqdn_), "expiry")
      .smembers(Key.HOST_OPERATORS_$SET(options?.net || Net.MAINNET, fqdn_))
      .smembers(Key.HOST_RECORDS_$SET(options?.net || Net.MAINNET, fqdn_, user))
      .exec();

    if (!results) return undefined;

    return {
      user: {
        address: results[0][1] as string,
        expiry: luxon.DateTime.fromMillis(parseInt(results[1][1] as string)),
      },
      operators: results[2][1] as string[],
      records: results[3][1] as string[],
    };
  }

  public async getTtl(fqdn: string, options?: IOptions): Promise<number | undefined> {
    const redis = createRedisClient();
    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);
    if (!(await this.isExists(fqdn, options))) undefined;
    const { host, name, tld } = extractFqdn(fqdn);
    if (!host) fqdn = `@.${name}.${tld}`;
    const ttl = await redis.get(Key.HOST_TTL_$KV(options?.net || Net.MAINNET, fqdn));
    return ttl ? parseInt(ttl) : undefined;
  }

  public async getMultiCoinAddressList(fqdn: string, options?: IOptions): Promise<IGetMultiCoinAddressListOutput> {
    const redis = createRedisClient();
    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);
    if (!(await this.isExists(fqdn, options))) [];
    if (await this.isExpired(fqdn, options)) throw new DomainExpiredError(fqdn);
    const { host, name, tld } = extractFqdn(fqdn);
    if (!host) fqdn = `@.${name}.${tld}`;
    const user = await redis.hget(Key.HOST_USER_$HASH(options?.net || Net.MAINNET, `${host}.${name}.${tld}`), "user");
    if (!user) return { records_list: [] };
    const _list_ = await redis.smembers(Key.HOST_RECORDS_$SET(options?.net || Net.MAINNET, fqdn, user));
    const list = _list_.filter((r) => r.startsWith("multi_coin_address:")).map((r) => r.replace("multi_coin_address:", ""));
    return { records_list: list };
  }

  public async getTypedTextList(fqdn: string, options?: IOptions): Promise<IGetTypedTextListOutput> {
    const redis = createRedisClient();
    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);
    if (!(await this.isExists(fqdn, options))) [];
    if (await this.isExpired(fqdn, options)) throw new DomainExpiredError(fqdn);
    const { host, name, tld } = extractFqdn(fqdn);
    if (!host) fqdn = `@.${name}.${tld}`;
    const user = await redis.hget(Key.HOST_USER_$HASH(options?.net || Net.MAINNET, `${host}.${name}.${tld}`), "user");
    if (!user) return { records_list: [] };
    const _list_ = await redis.smembers(Key.HOST_RECORDS_$SET(options?.net || Net.MAINNET, fqdn, user));
    const list = _list_.filter((r) => r.startsWith("typed_text:")).map((r) => r.replace("typed_text:", ""));
    return { records_list: list };
  }

  public async getUrlByPodName(podName: string, options?: IOptions): Promise<string> {
    const redis = await createRedisClient();
    const net = options?.net || Net.MAINNET;
    const url = await redis.hget(Key.DEDRIVE_DNS_$SET(net, podName), "url");
    if (!url) {
      throw new Error(" Url Record Not Found ");
    }
    return url;
  }
}

export class EdnsV2FromContractService implements IEdnsResolverService, IEdnsRegistryService {
  private async _getDomainChainId(domain: string, options?: IOptions): Promise<number> {
    const redis = createRedisClient();
    const { host, name, tld } = extractFqdn(domain);
    const inContractChain = await redis.hget(Key.DOMAIN_INFO_$HASH(options?.net || Net.MAINNET, `${name}.${tld}`), "chain");
    if (!inContractChain) throw new CantGetChainIdError(domain);
    return await getChainId(options?.net || Net.MAINNET, parseInt(inContractChain));
  }

  public async getUrlByPodName(podName: string, options?: IOptions): Promise<string> {
    const redis = await createRedisClient();
    const net = options?.net || Net.MAINNET;
    const url = await redis.hget(Key.DEDRIVE_DNS_$SET(net, podName), "url");
    if (!url) {
      throw new Error(" Url Record Not Found ");
    }
    return url;
  }
  public async getAllRecords(input: IGetAllRecordsInput, options?: IOptions | undefined): Promise<IGetAllRecordsOutput | undefined> {
    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);
    const _chainId = options?.chainId || (await this._getDomainChainId(input.fqdn, options));
    if (!(await this.isExists(input.fqdn, options, _chainId))) throw new DomainNotFoundError(input.fqdn);
    if (await this.isExpired(input.fqdn, options, _chainId)) throw new DomainExpiredError(input.fqdn);
    const contracts = getContracts(_chainId);

    const { host = "@", name, tld } = extractFqdn(input.fqdn);
    if (!name) throw new CantGetDomainNameError(input.fqdn);
    const ethHostByte = ethers.utils.toUtf8Bytes(host);
    const ethNameByte = ethers.utils.toUtf8Bytes(name);
    const ethTldByte = ethers.utils.toUtf8Bytes(tld);

    const address: string = await contracts.Resolver.getAddress(ethHostByte, ethNameByte, ethTldByte);
    const text: string = await contracts.Resolver.getText(ethHostByte, ethNameByte, ethTldByte);

    throw new Error("Method not implemented.");
  }

  public async getReverseAddressRecord(input: IGetReverseAddressRecordInput, options?: IOptions): Promise<IGetReverseAddressRecordOutput | undefined> {
    if (!options?.chainId) throw new MissingChainIdError();
    try {
      const contracts = getContracts(options.chainId);
      const fqdn = await contracts.Resolver.getReverseAddress(input.address);
      if (fqdn) return { fqdn };
      return undefined;
    } catch (error) {
      console.log(error);
    }
  }

  public async getAddressRecord(input: IGetAddressRecordInput, options?: IOptions): Promise<IGetAddressRecordOutput | undefined> {
    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);
    const _chainId = options?.chainId || (await this._getDomainChainId(input.fqdn, options));
    if (!(await this.isExists(input.fqdn, options, _chainId))) throw new DomainNotFoundError(input.fqdn);
    if (await this.isExpired(input.fqdn, options, _chainId)) throw new DomainExpiredError(input.fqdn);
    const contracts = getContracts(_chainId);

    const { host = "@", name, tld } = extractFqdn(input.fqdn);

    let result: IGetAddressRecordOutput | undefined = undefined;
    if (host && name && tld) {
      result = {
        address: await contracts.Resolver.getAddress(ethers.utils.toUtf8Bytes(host), ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld)),
      };
    }

    return result;
  }

  public async getMultiCoinAddressRecord(input: IGetMultiCoinAddressRecordInput, options?: IOptions): Promise<IGetMultiCoinAddressRecordOutput | undefined> {
    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);

    const _chainId = options?.chainId || (await this._getDomainChainId(input.fqdn, options));
    if (!(await this.isExists(input.fqdn, options, _chainId))) throw new DomainNotFoundError(input.fqdn);
    if (await this.isExpired(input.fqdn, options, _chainId)) throw new DomainExpiredError(input.fqdn);

    const contracts = getContracts(_chainId);

    const { host = "@", name, tld } = extractFqdn(input.fqdn);
    let result: IGetMultiCoinAddressRecordOutput | undefined = undefined;
    if (host && name && tld) {
      result = {
        coin: input.coin,
        address: await contracts.Resolver.getMultiCoinAddress(
          ethers.utils.toUtf8Bytes(host),
          ethers.utils.toUtf8Bytes(name),
          ethers.utils.toUtf8Bytes(tld),
          BigNumber.from(input.coin),
        ),
      };
    }
    if (!result || result.address === "0x") {
      return undefined;
    } else {
      return result;
    }
  }

  public async getTextRecord(input: IGetTextRecordInput, options?: IOptions): Promise<IGetTextRecordOutput | undefined> {
    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);
    const _chainId = options?.chainId || (await this._getDomainChainId(input.fqdn, options));
    if (!(await this.isExists(input.fqdn, options, _chainId))) throw new DomainNotFoundError(input.fqdn);
    if (await this.isExpired(input.fqdn, options, _chainId)) throw new DomainExpiredError(input.fqdn);
    const contracts = getContracts(_chainId);
    let result: IGetTextRecordOutput | undefined = undefined;
    const { host = "@", name, tld } = extractFqdn(input.fqdn);
    if (host && name && tld) {
      result = {
        text: await contracts.Resolver.getText(ethers.utils.toUtf8Bytes(host), ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld)),
      };
    }
    if (!result || result.text === "") {
      return undefined;
    } else {
      return result;
    }
  }

  public async getTypedTextRecord(input: IGetTypedTextRecordInput, options?: IOptions): Promise<IGetTypedTextRecordOutput | undefined> {
    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);

    const _chainId = options?.chainId || (await this._getDomainChainId(input.fqdn, options));
    if (!(await this.isExists(input.fqdn, options, _chainId))) throw new DomainNotFoundError(input.fqdn);
    if (await this.isExpired(input.fqdn, options, _chainId)) throw new DomainExpiredError(input.fqdn);

    const contracts = getContracts(_chainId);

    const _typed = ethers.utils.toUtf8Bytes(input.typed);

    const { host = "@", name, tld } = extractFqdn(input.fqdn);
    let result;
    if (host && name && tld) {
      result = {
        typed: input.typed,
        text: await contracts.Resolver.getTypedText(ethers.utils.toUtf8Bytes(host), ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld), _typed),
      };
    }
    if (!result || result.text === "") {
      return undefined;
    } else {
      return result;
    }
  }

  public async getNftRecord(input: IGetNftRecordInput, options?: IOptions): Promise<IGetNftRecordOutput | undefined> {
    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);
    const _chainId = options?.chainId || (await this._getDomainChainId(input.fqdn, options));
    if (!(await this.isExists(input.fqdn, options, _chainId))) throw new DomainNotFoundError(input.fqdn);
    if (await this.isExpired(input.fqdn, options, _chainId)) throw new DomainExpiredError(input.fqdn);

    const contracts = getContracts(_chainId);

    const { host = "@", name, tld } = extractFqdn(input.fqdn);
    let result;
    if (host && name && tld) {
      const [contractAddress, tokenId] = await contracts.Resolver.getNFT(
        ethers.utils.toUtf8Bytes(host),
        ethers.utils.toUtf8Bytes(name),
        ethers.utils.toUtf8Bytes(tld),
        input.chainId,
      );
      result = {
        chainId: input.chainId,
        contractAddress,
        tokenId: `${tokenId.toNumber()}`,
      };
    }
    if (!result || result.contractAddress === "0x0000000000000000000000000000000000000000") {
      return undefined;
    } else {
      return result;
    }
  }

  public async isExists(fqdn: string, options?: IOptions, _chainId?: number): Promise<boolean> {
    const chainId = options?.chainId || _chainId;
    if (!chainId) throw new Error("chainIdis missing");

    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);

    const contracts = getContracts(chainId);

    const { host, name, tld } = extractFqdn(fqdn);
    if (host && name && tld) {
      return await contracts.Registry["isExists(bytes32,bytes32,bytes32)"](
        ethers.utils.solidityKeccak256(["string"], [host]),
        ethers.utils.solidityKeccak256(["string"], [name]),
        ethers.utils.solidityKeccak256(["string"], [tld]),
      );
    } else if (name && tld) {
      return await contracts.Registry["isExists(bytes32,bytes32)"](ethers.utils.solidityKeccak256(["string"], [name]), ethers.utils.solidityKeccak256(["string"], [tld]));
    } else {
      return await contracts.Registry["isExists(bytes32)"](ethers.utils.keccak256(tld));
    }
  }

  public async isExpired(fqdn: string, options?: IOptions, _chainId?: number): Promise<boolean> {
    const chainId = options?.chainId || _chainId;
    if (!chainId) throw new Error("chainIdis missing");

    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);

    const contracts = getContracts(_chainId!);

    let time;
    const { host, name, tld } = extractFqdn(fqdn);
    if (name && tld) {
      time = await contracts.Registry["getExpiry(bytes32,bytes32)"](ethers.utils.solidityKeccak256(["string"], [name]), ethers.utils.solidityKeccak256(["string"], [tld]));
    } else {
      time = await contracts.Registry["getExpiry(bytes32)"](ethers.utils.keccak256(tld));
    }
    return timeIsPassed(time.toNumber());
  }

  public async getDomain(fqdn: string, options?: IOptions): Promise<IGetDomainOutput | undefined> {
    return new EdnsV2FromRedisService().getDomain(fqdn, options);
  }

  public async getDomainsByAccount(account: string, options?: IOptions): Promise<IGetDomainOutput[]> {
    return new EdnsV2FromRedisService().getDomainsByAccount(account, options);
  }

  public async getHost(fqdn: string, options?: IOptions): Promise<IGetHostOutput | undefined> {
    return new EdnsV2FromRedisService().getHost(fqdn, options);
  }

  public async getTtl(fqdn: string, options?: IOptions): Promise<number | undefined> {
    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);
    const _chainId = options?.chainId || (await this._getDomainChainId(fqdn, options));
    if (!(await this.isExists(fqdn, options, _chainId))) throw new DomainNotFoundError(fqdn);
    if (await this.isExpired(fqdn, options, _chainId)) throw new DomainExpiredError(fqdn);
    const contracts = getContracts(_chainId);
    const { host, name, tld } = extractFqdn(fqdn);
    if (host && name && tld) {
      const ttl = await contracts.Registry.getTtl(
        ethers.utils.solidityKeccak256(["string"], [host]),
        ethers.utils.solidityKeccak256(["string"], [name]),
        ethers.utils.solidityKeccak256(["string"], [tld]),
      );
      return ttl;
    }
    return undefined;
  }

  public async getOwner(fqdn: string, options?: IOptions): Promise<string | undefined> {
    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);
    const _chainId = options?.chainId || (await this._getDomainChainId(fqdn, options));
    if (!(await this.isExists(fqdn, options, _chainId))) throw new DomainNotFoundError(fqdn);
    if (await this.isExpired(fqdn, options, _chainId)) throw new DomainExpiredError(fqdn);
    const contracts = getContracts(_chainId);
    const { host, name, tld } = extractFqdn(fqdn);
    if (name && tld) {
      const owner = await contracts.Registry["getOwner(bytes32,bytes32)"](ethers.utils.solidityKeccak256(["string"], [name]), ethers.utils.solidityKeccak256(["string"], [tld]));
      return owner;
    }
    return undefined;
  }

  public async getExpiry(fqdn: string, options?: IOptions): Promise<number | undefined> {
    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);
    const _chainId = options?.chainId || (await this._getDomainChainId(fqdn, options));
    if (!(await this.isExists(fqdn, options, _chainId))) throw new DomainNotFoundError(fqdn);
    if (await this.isExpired(fqdn, options, _chainId)) throw new DomainExpiredError(fqdn);
    const contracts = getContracts(_chainId);
    const { host, name, tld } = extractFqdn(fqdn);
    if (name && tld) {
      const expiry = await contracts.Registry["getExpiry(bytes32,bytes32)"](ethers.utils.solidityKeccak256(["string"], [name]), ethers.utils.solidityKeccak256(["string"], [tld]));
      return expiry.toNumber();
    }
    return undefined;
  }
}

export class EdnsV2FromSubgraphService implements IEdnsResolverService, IEdnsRegistryService {
  private groupByDomainWithCombinedHosts = (data: any): IGetDomainOutputSubgraph[] => {
    const groupedData: any = {};

    for (const item of data) {
      const domain = item.domain.fqdn;
      const host = item.host;

      groupedData[domain] = groupedData[domain] || {
        host: [],
        domain: item.domain, // Copy the entire domain object
      };

      groupedData[domain].host.push(host);
    }

    return Object.values(groupedData); // Convert object to array for consistent output
  };

  public async isExists(fqdn: string, options?: IOptions | undefined, _chainId?: number | undefined): Promise<boolean> {
    const tokensQuery = `
    query MyQuery ($id: ID!){
      host(id: $id) {
        id
        ttl
        host
        fqdn
        domain {
          fqdn
        }
      }
    }
    `;

    const client = createClient({
      url: config.subgraph.url,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: fqdn })
      .toPromise()
      .then((res) => res.data);
    return data.host !== null;
  }
  public async isExpired(fqdn: string, options?: IOptions | undefined, _chainId?: number | undefined): Promise<boolean> {
    const tokensQuery = `
    query MyQuery ($id: ID!){
      domain(id: $id) {
        expiry
      }
    }
    `;

    const client = createClient({
      url: config.subgraph.url,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: fqdn })
      .toPromise()
      .then((res) => res.data);
    let _date;
    data.domain.expiry.toString().length === 10 ? (_date = new Date(data.domain.expiry * 1000)) : (_date = new Date(data.domain.expiry));
    const now = new Date();
    return now.getTime() > _date.getTime();
  }
  public async getDomain(fqdn: string, options?: IOptions | undefined): Promise<IGetDomainOutput | undefined> {
    const { chainId = 137 } = options || {};
    const tokensQuery = `
    query MyQuery ($id: ID!, $_id: String!){
      hosts(where: {domain: $_id}) {
        host
      }
      domain(id: $id) {
        expiry
        fqdn
        id
        name
        operator {
          address
        }
        resolver
        owner {
          address
        }
        user {
          address
          expiry
        }
      }
    }
    `;

    const client = createClient({
      url: config.subgraph.url,
      exchanges: [cacheExchange, fetchExchange],
    });

    let result;
    const data = await client
      .query(tokensQuery, { id: fqdn, _id: fqdn })
      .toPromise()
      .then((res) => res.data);
    console.log(data.domain.owner.address);

    result = {
      chain: chainId,
      owner: data.domain.owner.address,
      expiry: luxon.DateTime.fromSeconds(Number(data.domain.expiry)),
      resolver: data.domain.resolver ? data.domain.resolver : null,
      bridging: undefined,
      operators: data.domain.operator ? [data.domain.operator.address] : null,
      user: {
        address: data.domain.owner.address,
        expiry: luxon.DateTime.fromSeconds(Number(data.domain.expiry)),
      },
      hosts: data.hosts.map((host: { host: string }) => host.host),
    };

    return data.domain !== null
      ? result
      : { chain: undefined, owner: undefined, expiry: undefined, resolver: undefined, bridging: undefined, operators: undefined, user: undefined, hosts: undefined };
  }
  public async getDomainsByAccount(account: string, options?: IOptions | undefined): Promise<IGetDomainOutputSubgraph[] | undefined> {
    const tokensQuery = `
    query MyQuery ($id: ID!, $_id: String!){
      hosts(where: {domain: $_id}) {
        host
      }
      domain(id: $id) {
        expiry
        fqdn
        name
        operator {
          address
        }
        resolver
        owner {
          address
        }
        user {
          address
          expiry
        }
      }
    }
    `;

    const client = createClient({
      url: config.subgraph.url,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: account })
      .toPromise()
      .then((res) => res.data);
    return data.hosts !== null ? this.groupByDomainWithCombinedHosts(data.hosts) : undefined;
  }
  public async getHost(fqdn: string, options?: IOptions | undefined): Promise<IGetHostOutput | undefined> {
    const tokensQuery = `
    query MyQuery ($id: ID!){
      host(id: $id) {
        operator {
          address
        }
        user {
          address
          expiry
        }
        records {
          multiCoinAddressRecord {
            id
          }
          nftRecord {
            id
          }
          podRecord {
            podName
          }
          reverseAddressRecord {
            id
          }
          textRecord {
            id
          }
          typedtextRecord {
            typed
          }
        }
      }
    `;

    const client = createClient({
      url: config.subgraph.url,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: fqdn })
      .toPromise()
      .then((res) => res.data);
    let _record: any[] = [];

    for (const [key, record] of Object.entries(data.host.records)) {
      if (record !== null) {
        _record.push(key);
      }
    }
    return data.host !== null
      ? {
          operators: data.host.operator.address,
          user: {
            address: data.host.user.address,
            expiry: data.host.expiry,
          },
          records: _record,
        }
      : undefined;
  }
  public async getTtl(fqdn: string, options?: IOptions | undefined): Promise<number | undefined> {
    const tokensQuery = `
    query MyQuery ($id: ID!){
      host(id: $id) {
        ttl
      }
    }
    `;

    const client = createClient({
      url: config.subgraph.url,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: fqdn })
      .toPromise()
      .then((res) => res.data);

    return data.host !== null ? data.host.ttl : undefined;
  }
  public async getOwner(fqdn: string, options?: IOptions | undefined): Promise<string | undefined> {
    const tokensQuery = `
    query MyQuery ($id: ID!){
      host(id: $id) {
        owner {
          address
        }
      }
    `;

    const client = createClient({
      url: config.subgraph.url,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: fqdn })
      .toPromise()
      .then((res) => res.data);
    return data.host !== null ? data.host.owner.address : undefined;
  }
  public async getExpiry(fqdn: string, options?: IOptions | undefined): Promise<number | undefined> {
    const tokensQuery = `
    query MyQuery ($id: ID!){
      domain(id: $id) {
        expiry
      }
    }
    `;

    const client = createClient({
      url: config.subgraph.url,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: fqdn })
      .toPromise()
      .then((res) => res.data);
    let _date;
    data.domain.expiry.toString().length === 10 ? (_date = new Date(data.domain.expiry * 1000)) : (_date = new Date(data.domain.expiry));
    return _date.getTime();
  }
  public async getAllRecords(input: IGetAllRecordsInput, options?: IOptions | undefined): Promise<IGetAllRecordsOutput | undefined> {
    const tokensQuery = `
    query Test($id: ID!) {
      records(id: $id) {
        multiCoinAddressRecord {
          id
        }
        nftRecord {
          id
        }
        podRecord {
          id
        }
        reverseAddressRecord {
          id
        }
        textRecord {
          id
        }
        typedtextRecord {
          id
          typed
          text
        }
      }
    }
    `;

    const client = createClient({
      url: config.subgraph.url,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: input.fqdn })
      .toPromise()
      .then((res) => res.data);

    console.log(data);

    return data.records;
  }
  public async getReverseAddressRecord(input: IGetReverseAddressRecordInput, options?: IOptions | undefined): Promise<IGetReverseAddressRecordOutput | undefined> {
    const tokensQuery = `
      query Test($id: ID!){
        reverseAddressRecord (id:$id){
          id
          reverse_address
          records {
            host {
              fqdn
            }
          }
        }
      }
    `;

    const client = createClient({
      url: config.subgraph.url,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: input.address })
      .toPromise()
      .then((res) => res.data);
    return data.reverseAddressRecord !== null ? { fqdn: data.reverseAddressRecord.records.host.fqdn } : { fqdn: undefined };
  }
  public async getAddressRecord(input: IGetAddressRecordInput, options?: IOptions | undefined): Promise<IGetAddressRecordOutput | undefined> {
    const tokensQuery = `
      query Test($id: ID!){
        domain(id: $id) {
          owner {
            address
          }
        }
      }
    `;

    const client = createClient({
      url: config.subgraph.url,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: input.fqdn })
      .toPromise()
      .then((res) => res.data);
    return data.domain !== null ? { address: data.domain.owner.address } : { address: undefined };
  }
  public async getMultiCoinAddressRecord(input: IGetMultiCoinAddressRecordInput, options?: IOptions | undefined): Promise<IGetMultiCoinAddressRecordOutput | undefined> {
    const tokensQuery = `
    query Test($id: ID!){
      multiCoinAddressRecord(id: $id) {
        MultiCoinAddress
        multiCoinId
      }
    }
  `;

    const client = createClient({
      url: config.subgraph.url,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: input.fqdn })
      .toPromise()
      .then((res) => res.data);
    return data.multiCoinAddressRecord !== null
      ? { coin: data.multiCoinAddressRecord.multiCoinId, address: data.multiCoinAddressRecord.MultiCoinAddress }
      : { coin: undefined, address: undefined };
  }
  public async getTextRecord(input: IGetTextRecordInput, options?: IOptions | undefined): Promise<IGetTextRecordOutput | undefined> {
    const tokensQuery = `
    query Test($id: ID!){
      textRecord(id:$id) {
        text
      }
    }
  `;

    const client = createClient({
      url: config.subgraph.url,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: `${input.fqdn}_text` })
      .toPromise()
      .then((res) => res.data);
    return data.textRecord !== null ? { text: data.textRecord.text } : { text: undefined };
  }
  public async getTypedTextRecord(input: IGetTypedTextRecordInput, options?: IOptions | undefined): Promise<IGetTypedTextRecordOutput | undefined> {
    const tokensQuery = `
    query getTypeText($id: ID!){
      typedTextRecord(id: $id) {
        text
        typed
      }
    }
  `;
    const client = createClient({
      url: config.subgraph.url,
      exchanges: [cacheExchange, fetchExchange],
    });
    const data = await client
      .query(tokensQuery, { id: `${input.fqdn}_${input.typed}` })
      .toPromise()
      .then((res) => res.data);

    return data.typedTextRecord !== null ? { typed: data.typedTextRecord.typed, text: data.typedTextRecord.text } : { typed: undefined, text: undefined };
  }
  public async getNftRecord(input: IGetNftRecordInput, options?: IOptions | undefined): Promise<IGetNftRecordOutput | undefined> {
    const tokensQuery = `
    query Test($id: ID!){
      nftrecord(id: $id) {
        tokenId
        contract
        chainId
      }
    }
  `;
    const client = createClient({
      url: config.subgraph.url,
      exchanges: [cacheExchange, fetchExchange],
    });
    const data = await client
      .query(tokensQuery, { id: input.fqdn })
      .toPromise()
      .then((res) => res.data);
    return data.nftrecord !== null
      ? { chainId: data.nftrecord.chainId, contractAddress: data.nftrecord.contract, tokenId: data.nftrecord.tokenId }
      : { chainId: undefined, contractAddress: undefined, tokenId: undefined };
  }
  public async getUrlByPodName(podName: string, options?: IOptions | undefined): Promise<string | undefined> {
    const tokensQuery = `
    query Test($id: ID!)    {
      podRecord(id: $id) {
        url
      }
    }
  `;
    const client = createClient({
      url: config.subgraph.url,
      exchanges: [cacheExchange, fetchExchange],
    });
    const data = await client
      .query(tokensQuery, { id: podName })
      .toPromise()
      .then((res) => res.data);
    return data.podRecord !== null ? data.podRecord.url : undefined;
  }
}
