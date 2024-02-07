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
import { IEdnsRegistryService, IGetDomainOutput, IGetHostOutput } from "../interfaces/IEdnsRegistryService.interface";
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

    const { host, name, tld } = extractFqdn(input.fqdn);
    let address: string | undefined = undefined;
    const user = await redis.hget(Key.HOST_USER_$HASH(options?.net || Net.MAINNET, `${host}.${name}.${tld}`), "user");
    if (!user) return undefined;
    if (host && name && tld) {
      address = (await redis.hget(Key.HOST_RECORDS_$HASH(options?.net || Net.MAINNET, `${host}.${name}.${tld}`, user), "address")) || undefined;
    } else if (name && tld) {
      address = (await redis.hget(Key.HOST_RECORDS_$HASH(options?.net || Net.MAINNET, `@.${name}.${tld}`, user), "address")) || undefined;
    }
    if (!address) return { address: ZERO_ADDRESS };
    return { address };
  }

  public async getMultiCoinAddressRecord(input: IGetMultiCoinAddressRecordInput, options?: IOptions): Promise<IGetMultiCoinAddressRecordOutput | undefined> {
    const redis = createRedisClient();
    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);
    if (!(await this.isExists(input.fqdn, options))) return undefined;
    if (await this.isExpired(input.fqdn, options)) throw new DomainExpiredError(input.fqdn);

    const { host, name, tld } = extractFqdn(input.fqdn);
    let address: string | undefined = undefined;
    const user = await redis.hget(Key.HOST_USER_$HASH(options?.net || Net.MAINNET, `${host}.${name}.${tld}`), "user");
    if (!user) return undefined;
    if (host && name && tld) {
      address = (await redis.hget(Key.HOST_RECORDS_$HASH(options?.net || Net.MAINNET, `${host}.${name}.${tld}`, user), `multi_coin_address:${input.coin}`)) || undefined;
    } else if (name && tld) {
      address = (await redis.hget(Key.HOST_RECORDS_$HASH(options?.net || Net.MAINNET, `@.${name}.${tld}`, user), `multi_coin_address:${input.coin}`)) || undefined;
    }
    if (!address) return { coin: input.coin, address: ZERO_ADDRESS };
    return { coin: input.coin, address };
  }

  public async getTextRecord(input: IGetTextRecordInput, options?: IOptions): Promise<IGetTextRecordOutput | undefined> {
    const redis = createRedisClient();
    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);
    if (!(await this.isExists(input.fqdn, options))) return undefined;
    if (await this.isExpired(input.fqdn, options)) throw new DomainExpiredError(input.fqdn);

    const { host, name, tld } = extractFqdn(input.fqdn);
    let text: string | undefined = undefined;
    const user = await redis.hget(Key.HOST_USER_$HASH(options?.net || Net.MAINNET, `${host}.${name}.${tld}`), "user");
    if (!user) return undefined;
    if (host && name && tld) {
      text = (await redis.hget(Key.HOST_RECORDS_$HASH(options?.net || Net.MAINNET, `${host}.${name}.${tld}`, user), `text`)) || undefined;
    } else if (name && tld) {
      text = (await redis.hget(Key.HOST_RECORDS_$HASH(options?.net || Net.MAINNET, `@.${name}.${tld}`, user), `text`)) || undefined;
    }
    if (!text) return { text: undefined };
    return { text };
  }

  public async getTypedTextRecord(input: IGetTypedTextRecordInput, options?: IOptions): Promise<IGetTypedTextRecordOutput | undefined> {
    const redis = createRedisClient();
    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);
    if (!(await this.isExists(input.fqdn, options))) return undefined;
    if (await this.isExpired(input.fqdn, options)) throw new DomainExpiredError(input.fqdn);

    const { host, name, tld } = extractFqdn(input.fqdn);
    let text: string | undefined = undefined;
    const user = await redis.hget(Key.HOST_USER_$HASH(options?.net || Net.MAINNET, `${host}.${name}.${tld}`), "user");
    if (!user) return undefined;
    if (host && name && tld) {
      text = (await redis.hget(Key.HOST_RECORDS_$HASH(options?.net || Net.MAINNET, `${host}.${name}.${tld}`, user), `typed_text:${input.typed}`)) || undefined;
    } else if (name && tld) {
      text = (await redis.hget(Key.HOST_RECORDS_$HASH(options?.net || Net.MAINNET, `@.${name}.${tld}`, user), `typed_text:${input.typed}`)) || undefined;
    }

    if (!text) return { text: undefined, typed: input.typed };
    return { text, typed: input.typed };
  }

  public async getNftRecord(input: IGetNftRecordInput, options?: IOptions): Promise<IGetNftRecordOutput | undefined> {
    const redis = createRedisClient();
    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);
    if (!(await this.isExists(input.fqdn, options))) return undefined;
    if (await this.isExpired(input.fqdn, options)) throw new DomainExpiredError(input.fqdn);

    const { host, name, tld } = extractFqdn(input.fqdn);

    let result: string | undefined = undefined;
    const user = await redis.hget(Key.HOST_USER_$HASH(options?.net || Net.MAINNET, `${host}.${name}.${tld}`), "user");
    if (!user) return undefined;
    if (host && name && tld) {
      result = (await redis.hget(Key.HOST_RECORDS_$HASH(options?.net || Net.MAINNET, `${host}.${name}.${tld}`, user), `nft:${input.chainId}`)) || undefined;
    } else if (name && tld) {
      result = (await redis.hget(Key.HOST_RECORDS_$HASH(options?.net || Net.MAINNET, `@.${name}.${tld}`, user), `nft:${input.chainId}`)) || undefined;
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
    let { host, name, tld } = extractFqdn(fqdn);
    if (!name) throw new CantGetDomainNameError(fqdn);
    if (!host) host = "@";
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
}

export class EdnsV2FromContractService implements IEdnsResolverService, IEdnsRegistryService {
  private async _getDomainChainId(domain: string, options?: IOptions): Promise<number> {
    const redis = createRedisClient();
    const { host, name, tld } = extractFqdn(domain);
    const inContractChain = await redis.hget(Key.DOMAIN_INFO_$HASH(options?.net || Net.MAINNET, `${name}.${tld}`), "chain");
    if (!inContractChain) throw new CantGetChainIdError(domain);
    return await getChainId(options?.net || Net.MAINNET, parseInt(inContractChain));
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
    const contracts = getContracts(options.chainId);

    const fqdn = await contracts.Resolver.getReverseAddress(input.address);
    if (fqdn) return { fqdn };
    return undefined;
  }

  public async getAddressRecord(input: IGetAddressRecordInput, options?: IOptions): Promise<IGetAddressRecordOutput | undefined> {
    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);
    const _chainId = options?.chainId || (await this._getDomainChainId(input.fqdn, options));
    if (!(await this.isExists(input.fqdn, options, _chainId))) throw new DomainNotFoundError(input.fqdn);
    if (await this.isExpired(input.fqdn, options, _chainId)) throw new DomainExpiredError(input.fqdn);
    const contracts = getContracts(_chainId);

    const { host, name, tld } = extractFqdn(input.fqdn);

    let result: IGetAddressRecordOutput | undefined = undefined;
    if (host && name && tld) {
      result = {
        address: await contracts.Resolver.getAddress(ethers.utils.toUtf8Bytes(host), ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld)),
      };
    } else if (name && tld) {
      result = {
        address: await contracts.Resolver.getAddress(ethers.utils.toUtf8Bytes("@"), ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld)),
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

    const { host, name, tld } = extractFqdn(input.fqdn);
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
    } else if (name && tld) {
      result = {
        coin: input.coin,
        address: await contracts.Resolver.getMultiCoinAddress(
          ethers.utils.toUtf8Bytes("@"),
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
    const { host, name, tld } = extractFqdn(input.fqdn);
    if (host && name && tld) {
      result = {
        text: await contracts.Resolver.getText(ethers.utils.toUtf8Bytes(host), ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld)),
      };
    } else if (name && tld) {
      result = {
        text: await contracts.Resolver.getText(ethers.utils.toUtf8Bytes("@"), ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld)),
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

    const { host, name, tld } = extractFqdn(input.fqdn);
    let result;
    if (host && name && tld) {
      result = {
        typed: input.typed,
        text: await contracts.Resolver.getTypedText(ethers.utils.toUtf8Bytes(host), ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld), _typed),
      };
    } else if (name && tld) {
      result = {
        typed: input.typed,
        text: await contracts.Resolver.getTypedText(ethers.utils.toUtf8Bytes("@"), ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld), _typed),
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

    const { host, name, tld } = extractFqdn(input.fqdn);
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
    } else if (name && tld) {
      const [contractAddress, tokenId] = await contracts.Resolver.getNFT(
        ethers.utils.toUtf8Bytes("@"),
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
