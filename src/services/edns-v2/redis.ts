import { Net } from "../../network-config";
import * as luxon from "luxon";
import { createRedisClient } from "../../utils/create-redis-client";
import { isValidFqdn } from "../../utils/is-valid-fqdn";
import { extractFqdn } from "../../utils/extract-fqdn";
import _ from "lodash";
import { InvalidFqdnError } from "../../errors/invalid-fqdn.error";
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
} from "../../interfaces/IEdnsResolverService.interface";
import { IOptions } from "../../interfaces/IOptions.interface";
import { IEdnsRegistryService, IGetDomainOutput, IGetHostOutput } from "../../interfaces/IEdnsRegistryService.interface";
import { CantGetDomainNameError } from "../../errors/cant-get-domain-name.error";
import { timeIsPassed } from "../../utils/time-is-passed";
import { DomainExpiredError } from "../../errors/domain-expired.error";
import { getChainId } from "../../utils/get-chain-id";
import { ZERO_ADDRESS } from "../../network-config";
import { Key } from "../../app/listener/handler";

export class EdnsV2FromRedisService implements IEdnsResolverService, IEdnsRegistryService {
  public async getAllRecords(input: IGetAllRecordsInput, options?: IOptions | undefined): Promise<IGetAllRecordsOutput | undefined> {
    const redis = await createRedisClient();
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
    const redis = await createRedisClient();
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
    const redis = await createRedisClient();
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
    const redis = await createRedisClient();

    const fqdn = await redis.get(Key.ACCOUNT_BRIDGE_REQUESTED_$SET(options?.net || Net.MAINNET, input.address));
    if (!fqdn) return undefined;
    return { fqdn };
  }

  public async getAddressRecord(input: IGetAddressRecordInput, options?: IOptions): Promise<IGetAddressRecordOutput | undefined> {
    const redis = await createRedisClient();
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
    const redis = await createRedisClient();
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
    const redis = await createRedisClient();
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
    const redis = await createRedisClient();
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
    const redis = await createRedisClient();
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
    const redis = await createRedisClient();

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
    const redis = await createRedisClient();
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
    const redis = await createRedisClient();

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
    const redis = await createRedisClient();
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
    const redis = await createRedisClient();
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
    const redis = await createRedisClient();
    const _domains_ = await redis.smembers(Key.ACCOUNT_DOMAINS_$SET(options?.net || Net.MAINNET, account));
    const domains = await Promise.all(_domains_.map((d) => this.getDomain(d, options)));
    return domains.filter((d) => !!d) as IGetDomainOutput[]; //TO-DO: empty result is {} instead of undefined
  }

  public async getHost(fqdn: string, options?: IOptions): Promise<IGetHostOutput | undefined> {
    const redis = await createRedisClient();
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
    const redis = await createRedisClient();
    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);
    if (!(await this.isExists(fqdn, options))) undefined;
    const { host, name, tld } = extractFqdn(fqdn);
    if (!host) fqdn = `@.${name}.${tld}`;
    const ttl = await redis.get(Key.HOST_TTL_$KV(options?.net || Net.MAINNET, fqdn));
    return ttl ? parseInt(ttl) : undefined;
  }

  public async getMultiCoinAddressList(fqdn: string, options?: IOptions): Promise<IGetMultiCoinAddressListOutput> {
    const redis = await createRedisClient();
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
    const redis = await createRedisClient();
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
