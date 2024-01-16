import "source-map-support/register";
import { SQSHandler } from "aws-lambda";
import Redis from "ioredis";
import _ from "lodash";
import { createLogger } from "../../utils/create-logger";
import { DomainProvider } from "../../constants/domain-provider.constant";
import { EdnsEventType } from "../../constants/event-type.constant";
import { setEnvironmentVariable } from "../../utils/set-environment-variable";
import { createProvider } from "../../utils/create-provider";
import EdnsContractsAddress from "../../static/edns-contracts-address.json";
import { Bridge__factory } from "../../contracts/ethereum/edns-v2/typechain/factories/Bridge__factory";
import { getConfig } from "../../config";
import { getInContractChain } from "../../utils/get-in-contract-chain";
import { EdnsV2FromContractService, EdnsV2FromRedisService } from "../../services/edns-v2.service";
import { Net } from "../../network-config";

const logger = createLogger();

let client: Redis | undefined;

export interface IBody {
  chainId: number;
  provider: DomainProvider;
  eventType: EdnsEventType;
  fqdn: string;
  net: Net;
  data: any;
}

interface IBaseSetRecordData {
  host: string;
  name: string;
  tld: string;
}

interface IDomainRegisteredData {
  chain: number;
  name: string;
  tld: string;
  owner: string;
  expiry: number;
}

interface IDomainRenewedData {
  name: string;
  tld: string;
  expiry: number;
}

// interface IDomainBridgedData {
// 	name: string;
// 	tld: string;
// 	dstChain: Chain;
// }

interface ISetDomainOwner {
  name: string;
  tld: string;
  newOwner: string;
}

interface IBridgeRequestedData {
  chainId: number;
  ref: string;
}

interface IBridgeAcceptedData {
  chainId: number;
  ref: string;
}

interface ISetReverseAddressRecordData extends IBaseSetRecordData {
  address: string;
}

interface IUnsetReverseAddressRecordData extends IBaseSetRecordData {
  address: string;
}

interface ISetAddressRecordData extends IBaseSetRecordData {
  address: string;
}

interface IUnsetAddressRecordData extends IBaseSetRecordData {}

interface ISetMultiCoinAddressRecordData extends IBaseSetRecordData {
  coin: number;
  address: string;
}

interface IUnsetMultiCoinAddressRecordData extends IBaseSetRecordData {
  coin: number;
}

interface ISetTextRecordData extends IBaseSetRecordData {
  text: string;
}

interface IUnsetTextRecordData extends IBaseSetRecordData {
  text: string;
}

interface ISetTypedTextRecordData extends IBaseSetRecordData {
  type: string;
  text: string;
}

interface IUnsetTypedTextRecordData extends IBaseSetRecordData {
  type: string;
}

interface ISetNftRecordData extends IBaseSetRecordData {
  chainId: string;
  contractAddress: string;
  tokenId: string;
}

interface IUnsetNftRecordData extends IBaseSetRecordData {
  chainId: string;
}

interface ISetDomainResolverData {
  name: string;
  tld: string;
  newResolver: string;
}

interface ISetDomainOperatorData {
  name: string;
  tld: string;
  operator: string;
  approved: boolean;
}

interface ISetDomainUserData {
  name: string;
  tld: string;
  newUser: string;
  expiry: number;
}

interface INewHostData {
  host: string;
  name: string;
  tld: string;
  ttl: number;
}

interface IRemoveHostData {
  host: string;
  name: string;
  tld: string;
}

interface ISetHostOperatorData {
  host: string;
  name: string;
  tld: string;
  operator: string;
  approved: boolean;
}

interface ISetHostUserData {
  host: string;
  name: string;
  tld: string;
  newUser: string;
  expiry: number;
}

interface IRevalidateData {
  host: string;
  name: string;
  tld: string;
  chainId: number;
}

export class Key {
  // Domain
  public static DOMAIN_INFO_$HASH(net: Net, domain: string): string {
    return `edns:${net}:domain:${domain}:info`;
  }
  public static DOMAIN_USER_$HASH(net: Net, domain: string): string {
    return `edns:${net}:domain:${domain}:user`;
  }
  public static DOMAIN_HOSTS_$SET(net: Net, domain: string): string {
    return `edns:${net}:domain:${domain}:hosts`;
  }
  public static DOMAIN_OPERATORS_$SET(net: Net, domain: string): string {
    return `edns:${net}:domain:${domain}:operators`;
  }
  // Host
  public static HOST_RECORDS_$HASH(net: Net, fqdn: string, user: string): string {
    // return `edns:${net}:host:${fqdn}:${user}:records`;
    return `edns:${net}:host:${fqdn}:records`;
  }
  public static HOST_RECORDS_$SET(net: Net, fqdn: string, user: string): string {
    // return `edns:${net}:host:${fqdn}:${user}:list`;
    return `edns:${net}:host:${fqdn}:list`;
  }
  public static HOST_USER_$HASH(net: Net, fqdn: string): string {
    return `edns:${net}:host:${fqdn}:user`;
  }
  public static HOST_OPERATORS_$SET(net: Net, fqdn: string): string {
    return `edns:${net}:host:${fqdn}:operators`;
  }
  public static HOST_TTL_$KV(net: Net, fqdn: string): string {
    return `edns:${net}:host:${fqdn}:ttl`;
  }
  // Account
  public static ACCOUNT_REVERSE_DOMAIN_$KV(net: Net, account: string): string {
    return `edns:${net}:account:${account}:reverse_domain`;
  }
  public static ACCOUNT_DOMAINS_$SET(net: Net, account: string): string {
    return `edns:${net}:account:${account}:domains`;
  }
  public static ACCOUNT_DOMAIN_OPERATORS_$SET(net: Net, account: string): string {
    return `edns:${net}:account:${account}:domain:operators`;
  }
  public static ACCOUNT_HOST_OPERATORS_$SET(net: Net, account: string): string {
    return `edns:${net}:account:${account}:host:operators`;
  }
  public static ACCOUNT_BRIDGE_REQUESTED_$SET(net: Net, account: string): string {
    return `edns:${net}:account:${account}:bridge:requested`;
  }
  public static ACCOUNT_BRIDGE_ACCEPTED_$SET(net: Net, account: string): string {
    return `edns:${net}:account:${account}:bridge:accepted`;
  }
}
/**
 * edns:domain:DOMAIN:info => Hash - The info of the domain
 * edns:domain:DOMAIN:user => Hash - The user info of the domain
 * edns:domain:DOMAIN:hosts => Set - The list of the hosts under the domain
 * edns:domain:DOMAIN:operators => Set - The operators of the domain
 * edns:host:FQDN:records => Hash - The records of the host
 * edns:host:FQDN:records:list => SET - The list of type of records has been set for the host
 * edns:host:FQDN:user => Hash - The user info of the host
 * edns:host:FQDN:operators => Set - The operators of the host
 * edns:account:ADDRESS:reverse_domain => Key - The reverse domain of the address
 * edns:account:ADDRESS:domains => Set - The list of the domains owned by the address
 * edns:account:ADDRESS:domain:operators => Set - The list of domains which is a operator by the address
 * edns:account:ADDRESS:host:operators => Set - The list of hosts which is a operator by the address
 * edns:account:ADDRESS:bridge:requested => Set - The list of bridge requests by the address
 * edns:account:ADDRESS:bridge:accepted => Set - The list of bridge accepted requests by the address
 */

export const main = async (body: IBody): Promise<void> => {
  const config = getConfig();
  if (!client) client = new Redis(config.redis.url);
  logger.debug(body);
  switch (body.eventType) {
    case EdnsEventType.DOMAIN_REGISTERED: {
      const data: IDomainRegisteredData = body.data;
      const domain = `${data.name}.${data.tld}`;

      const dels: string[] = [];

      let batch = client.multi();

      // Check is the domain previously registered
      const prevUser = await client.hget(Key.DOMAIN_INFO_$HASH(body.net, domain), "owner");
      if (prevUser) {
        // Remove the domain from the previous owner
        batch = batch.srem(Key.ACCOUNT_DOMAINS_$SET(body.net, data.owner), domain);

        // Delete all of the previous domain record;
        dels.push(
          Key.DOMAIN_INFO_$HASH(body.net, domain),
          Key.DOMAIN_USER_$HASH(body.net, domain),
          Key.DOMAIN_HOSTS_$SET(body.net, domain),
          Key.DOMAIN_OPERATORS_$SET(body.net, domain),
        );

        // Removed the domain from the address relationship
        const operators = await client.smembers(Key.DOMAIN_OPERATORS_$SET(body.net, domain));
        if (operators.length) {
          operators.forEach((operator) => {
            batch = batch.srem(Key.ACCOUNT_DOMAIN_OPERATORS_$SET(body.net, operator), domain);
          });
        }

        // Remove all relative data about the host(s) under the domain
        const _hosts = await client.smembers(Key.DOMAIN_HOSTS_$SET(body.net, domain));
        if (_hosts.length) {
          for (const _host of _hosts) {
            const service = new EdnsV2FromRedisService();
            const _host_data = await service.getHost(`${_host}.${domain}`);
            if (!_host_data?.user?.address) throw new Error(`User not found for ${_host}.${domain}`);
            const _user = _host_data.user.address;
            dels.push(
              Key.HOST_RECORDS_$HASH(body.net, `${_host}.${domain}`, _user),
              Key.HOST_USER_$HASH(body.net, `${_host}.${domain}`),
              Key.HOST_OPERATORS_$SET(body.net, `${_host}.${domain}`),
            );
          }

          const queue: Promise<void>[] = [];
          for (const _host of _hosts) {
            async function exec(client: Redis): Promise<void> {
              const _operators = await client.smembers(Key.HOST_OPERATORS_$SET(body.net, `${_host}.${domain}`));
              if (_operators.length) {
                _operators.forEach((operator) => {
                  batch = batch.srem(Key.ACCOUNT_HOST_OPERATORS_$SET(body.net, operator), `${_host}.${domain}`);
                });
              }
            }
            queue.push(exec(client));
          }
          await Promise.all(queue);
        }
      }

      // Add to the batch if there any key(s) need to delete
      if (dels.length) batch = batch.del(dels);

      // batch = batch.sadd(Key.ACCOUNT_DOMAINS_$SET(body.net, data.owner), domain);

      await batch
        .sadd(Key.ACCOUNT_DOMAINS_$SET(body.net, data.owner), domain)
        .hmset(Key.DOMAIN_INFO_$HASH(body.net, domain), {
          owner: data.owner,
          expiry: data.expiry,
          chain: data.chain,
        })
        .hmset(Key.DOMAIN_USER_$HASH(body.net, domain), {
          user: data.owner,
          expiry: data.expiry,
        })
        .expireat(Key.DOMAIN_INFO_$HASH(body.net, domain), data.expiry)
        .expireat(Key.DOMAIN_USER_$HASH(body.net, domain), data.expiry)
        .exec()
        .catch((error) => {
          logger.error(error);
        });
      logger.info("Exec DOMAIN_REGISTERED");
      break;
    }
    case EdnsEventType.DOMAIN_RENEWED: {
      const data: IDomainRenewedData = body.data;
      const domain = `${data.name}.${data.tld}`;

      let batch = client.pipeline();

      // Update all the `EXPIRE` of the host(s) relative data
      const _hosts = await client.smembers(Key.DOMAIN_HOSTS_$SET(body.net, domain));
      if (_hosts.length) {
        for (const _host of _hosts) {
          const service = new EdnsV2FromRedisService();
          const _host_data = await service.getHost(`${_host}.${domain}`);
          if (!_host_data?.user?.address) throw new Error(`User not found for ${_host}.${domain}`);
          const _user = _host_data.user.address;
          batch = batch
            .expireat(Key.HOST_RECORDS_$HASH(body.net, `${_host}.${domain}`, _user), data.expiry)
            .expireat(Key.HOST_USER_$HASH(body.net, `${_host}.${domain}`), data.expiry)
            .expireat(Key.HOST_OPERATORS_$SET(body.net, `${_host}.${domain}`), data.expiry);
        }
      }

      // Update all the `EXPIRE` of the domain relative data
      batch = batch
        .hset(Key.DOMAIN_INFO_$HASH(body.net, domain), "expiry", data.expiry)
        .hset(Key.DOMAIN_USER_$HASH(body.net, domain), "expiry", data.expiry)
        .expireat(Key.DOMAIN_INFO_$HASH(body.net, domain), data.expiry)
        .expireat(Key.DOMAIN_USER_$HASH(body.net, domain), data.expiry);

      // Execute
      await batch.exec();

      break;
    }
    // case EdnsEventType.DOMAIN_BRIDGED: {
    // 	const data: IDomainBridgedData = body.data;
    // 	const domain = `${data.name}.${data.tld}`;

    // 	let batch = client.pipeline();

    // 	const dels: string[] = [];

    // 	// Remove all relative data about the host(s) under the domain
    // 	const _hosts = await client.smembers(Key.DOMAIN_HOSTS_$SET(body.net, domain));
    // 	if (_hosts.length) {
    // 		dels.push(
    // 			..._.flatten(
    // 				_hosts.map((_host) => [
    // 					Key.HOST_RECORDS_$HASH(body.net, `${_host}.${domain}`),
    // 					Key.HOST_USER_$HASH(body.net, `${_host}.${domain}`),
    // 					Key.HOST_OPERATORS_$SET(body.net, `${_host}.${domain}`),
    // 				])
    // 			)
    // 		);
    // 		const queue: Promise<void>[] = [];
    // 		for (const _host of _hosts) {
    // 			async function exec(client: Redis): Promise<void> {
    // 				const _operators = await client.smembers(Key.HOST_OPERATORS_$SET(body.net, `${_host}.${domain}`));
    // 				if (_operators.length) {
    // 					_operators.forEach((operator) => {
    // 						batch = batch.srem(Key.ACCOUNT_HOST_OPERATORS_$SET(body.net, operator), `${_host}.${domain}`);
    // 					});
    // 				}
    // 			}
    // 			queue.push(exec(client));
    // 		}
    // 		await Promise.all(queue);
    // 	}

    // 	const [owner, expiry] = await client.hmget(Key.DOMAIN_INFO_$HASH(body.net, domain), "owner", "expiry");
    // 	if (owner && expiry) {
    // 		batch = batch.hmset(Key.DOMAIN_USER_$HASH(body.net, domain), { user: owner, expiry: expiry });
    // 	}

    // 	await batch.hset(Key.DOMAIN_INFO_$HASH(body.net, domain), "chain", data.dstChain).exec();

    // 	break;
    // }
    case EdnsEventType.SET_DOMAIN_OWNER: {
      const data: ISetDomainOwner = body.data;
      const domain = `${data.name}.${data.tld}`;

      await client.hset(Key.DOMAIN_INFO_$HASH(body.net, domain), "owner", data.newOwner);

      break;
    }
    case EdnsEventType.SET_DOMAIN_OPERATOR: {
      const data: ISetDomainOperatorData = body.data;
      const domain = `${data.name}.${data.tld}`;

      if (data.approved) {
        await client.pipeline().sadd(Key.DOMAIN_OPERATORS_$SET(body.net, domain), data.operator).sadd(Key.ACCOUNT_DOMAIN_OPERATORS_$SET(body.net, data.operator), domain).exec();
      } else {
        await client.pipeline().srem(Key.DOMAIN_OPERATORS_$SET(body.net, domain), data.operator).srem(Key.ACCOUNT_DOMAIN_OPERATORS_$SET(body.net, data.operator), domain).exec();
      }

      break;
    }
    case EdnsEventType.SET_DOMAIN_RESOLVER: {
      const data: ISetDomainResolverData = body.data;
      const domain = `${data.name}.${data.tld}`;
      await client.hmset(Key.DOMAIN_INFO_$HASH(body.net, domain), {
        resolver: data.newResolver,
      });
      break;
    }
    case EdnsEventType.SET_DOMAIN_USER: {
      const data: ISetDomainUserData = body.data;
      const domain = `${data.name}.${data.tld}`;
      await client
        .pipeline()
        .hmset(Key.DOMAIN_USER_$HASH(body.net, domain), {
          user: data.newUser,
          expiry: data.expiry,
        })
        .expireat(Key.DOMAIN_USER_$HASH(body.net, domain), data.expiry)
        .exec();
      break;
    }
    case EdnsEventType.NEW_HOST: {
      const data: INewHostData = body.data;
      const domain = `${data.name}.${data.tld}`;
      let batch = client.pipeline();
      const [user, expiry] = await client.hmget(Key.DOMAIN_USER_$HASH(body.net, domain), "user", "expiry");
      if (user && expiry) {
        batch = batch.hmset(Key.HOST_USER_$HASH(body.net, `${data.host}.${domain}`), {
          user,
          expiry,
        });
      }
      await batch
        .sadd(Key.DOMAIN_HOSTS_$SET(body.net, data.host), data.host)
        .set(Key.HOST_TTL_$KV(body.net, `${data.host}.${domain}`), data.ttl)
        .exec();
      break;
    }
    case EdnsEventType.REMOVE_HOST: {
      const data: IRemoveHostData = body.data;
      const domain = `${data.name}.${data.tld}`;
      await client
        .pipeline()
        .del(Key.HOST_USER_$HASH(body.net, `${data.host}.${domain}`))
        .srem(Key.DOMAIN_HOSTS_$SET(body.net, data.host), data.host)
        .del(Key.HOST_TTL_$KV(body.net, `${data.host}.${domain}`))
        .exec();
      break;
    }
    case EdnsEventType.SET_HOST_OPERATOR: {
      const data: ISetHostOperatorData = body.data;
      const domain = `${data.name}.${data.tld}`;

      if (data.approved) {
        await client
          .pipeline()
          .sadd(Key.HOST_OPERATORS_$SET(body.net, `${data.host}.${domain}`), data.operator)
          .sadd(Key.ACCOUNT_HOST_OPERATORS_$SET(body.net, data.operator), `${data.host}.${domain}`)
          .exec();
      } else {
        await client
          .pipeline()
          .srem(Key.HOST_OPERATORS_$SET(body.net, `${data.host}.${domain}`), data.operator)
          .srem(Key.ACCOUNT_HOST_OPERATORS_$SET(body.net, data.operator), `${data.host}.${domain}`)
          .exec();
      }

      break;
    }
    case EdnsEventType.SET_HOST_USER: {
      const data: ISetHostUserData = body.data;
      const domain = `${data.name}.${data.tld}`;

      await client
        .hmset(Key.HOST_USER_$HASH(body.net, `${data.host}.${domain}`), {
          user: data.newUser,
          expiry: data.expiry,
        })
        .catch((error) => {
          console.log(error);
        });
      logger.info("Exec SET_HOST_USER");

      break;
    }
    case EdnsEventType.SET_REVERSE_ADDRESS_RECORD: {
      const data: ISetReverseAddressRecordData = body.data;
      const fqdn = `${data.host}.${data.name}.${data.tld}`;
      const user = await client.hget(Key.DOMAIN_USER_$HASH(body.net, fqdn), "user");
      if (user) {
        await client
          .pipeline()
          .set(Key.ACCOUNT_REVERSE_DOMAIN_$KV(body.net, data.address), fqdn)
          .sadd(Key.HOST_RECORDS_$SET(body.net, fqdn, user), "reverse_address")
          .exec()
          .catch((error) => {
            console.log(error);
          });
      }
      logger.info("Exec SET_REVERSE_ADDRESS_RECORD");

      break;
    }
    case EdnsEventType.UNSET_REVERSE_ADDRESS_RECORD: {
      const data: IUnsetReverseAddressRecordData = body.data;
      const fqdn = `${data.host}.${data.name}.${data.tld}`;

      const service = new EdnsV2FromRedisService();
      const _host_data = await service.getHost(fqdn);
      if (!_host_data?.user?.address) throw new Error(`User not found for ${fqdn}`);
      const user = _host_data.user.address;

      await client
        .pipeline()
        .del(Key.ACCOUNT_REVERSE_DOMAIN_$KV(body.net, data.address))
        .srem(Key.HOST_RECORDS_$SET(body.net, fqdn, user), "reverse_address")
        .exec()
        .catch((error) => {
          console.log(error);
        });

      logger.info("Exec UNSET_REVERSE_ADDRESS_RECORD");

      break;
    }
    case EdnsEventType.SET_ADDRESS_RECORD: {
      const data: ISetAddressRecordData = body.data;
      const fqdn = `${data.host}.${data.name}.${data.tld}`;

      const service = new EdnsV2FromRedisService();
      const _host_data = await service.getHost(fqdn);
      if (!_host_data?.user?.address) throw new Error(`User not found for ${fqdn}`);
      const user = _host_data.user.address;

      await client
        .pipeline()
        .hset(Key.HOST_RECORDS_$HASH(body.net, fqdn, user), "address", data.address)
        .sadd(Key.HOST_RECORDS_$SET(body.net, fqdn, user), "address")
        .exec();

      break;
    }
    case EdnsEventType.UNSET_ADDRESS_RECORD: {
      const data: IUnsetAddressRecordData = body.data;
      const fqdn = `${data.host}.${data.name}.${data.tld}`;

      const service = new EdnsV2FromRedisService();
      const _host_data = await service.getHost(fqdn);
      if (!_host_data?.user?.address) throw new Error(`User not found for ${fqdn}`);
      const user = _host_data.user.address;

      await client
        .pipeline()
        .hdel(Key.HOST_RECORDS_$HASH(body.net, fqdn, user), "address")
        .srem(Key.HOST_RECORDS_$SET(body.net, fqdn, user), "address")
        .exec();

      break;
    }
    case EdnsEventType.SET_MULTI_COIN_ADDRESS_RECORD: {
      const data: ISetMultiCoinAddressRecordData = body.data;
      const fqdn = `${data.host}.${data.name}.${data.tld}`;

      const service = new EdnsV2FromRedisService();
      const _host_data = await service.getHost(fqdn);
      if (!_host_data?.user?.address) throw new Error(`User not found for ${fqdn}`);
      const user = _host_data.user.address;

      await client
        .pipeline()
        .hset(Key.HOST_RECORDS_$HASH(body.net, fqdn, user), `multi_coin_address:${data.coin}`, data.address)
        .sadd(Key.HOST_RECORDS_$SET(body.net, fqdn, user), `multi_coin_address:${data.coin}`)
        .exec();

      break;
    }
    case EdnsEventType.UNSET_MULTI_COIN_ADDRESS_RECORD: {
      const data: IUnsetMultiCoinAddressRecordData = body.data;
      const fqdn = `${data.host}.${data.name}.${data.tld}`;

      const service = new EdnsV2FromRedisService();
      const _host_data = await service.getHost(fqdn);
      if (!_host_data?.user?.address) throw new Error(`User not found for ${fqdn}`);
      const user = _host_data.user.address;

      await client
        .pipeline()
        .hdel(Key.HOST_RECORDS_$HASH(body.net, fqdn, user), `multi_coin_address:${data.coin}`)
        .srem(Key.HOST_RECORDS_$SET(body.net, fqdn, user), `multi_coin_address:${data.coin}`)
        .exec();

      break;
    }
    case EdnsEventType.SET_NFT_RECORD: {
      const data: ISetNftRecordData = body.data;
      const fqdn = `${data.host}.${data.name}.${data.tld}`;

      const service = new EdnsV2FromRedisService();
      const _host_data = await service.getHost(fqdn);
      if (!_host_data?.user?.address) throw new Error(`User not found for ${fqdn}`);
      const user = _host_data.user.address;

      await client
        .pipeline()
        .hset(Key.HOST_RECORDS_$HASH(body.net, fqdn, user), `nft:${data.chainId}`, `${data.contractAddress}:${data.tokenId}`)
        .sadd(Key.HOST_RECORDS_$SET(body.net, fqdn, user), `nft:${data.chainId}`)
        .exec();

      break;
    }
    case EdnsEventType.UNSET_NFT_RECORD: {
      const data: IUnsetNftRecordData = body.data;
      const fqdn = `${data.host}.${data.name}.${data.tld}`;

      const service = new EdnsV2FromRedisService();
      const _host_data = await service.getHost(fqdn);
      if (!_host_data?.user?.address) throw new Error(`User not found for ${fqdn}`);
      const user = _host_data.user.address;

      await client
        .pipeline()
        .hdel(Key.HOST_RECORDS_$HASH(body.net, fqdn, user), `nft:${data.chainId}`)
        .srem(Key.HOST_RECORDS_$SET(body.net, fqdn, user), `nft:${data.chainId}`)
        .exec();

      break;
    }
    case EdnsEventType.SET_TEXT_RECORD: {
      const data: ISetTextRecordData = body.data;
      const fqdn = `${data.host}.${data.name}.${data.tld}`;

      const service = new EdnsV2FromRedisService();
      const _host_data = await service.getHost(fqdn);
      if (!_host_data?.user?.address) throw new Error(`User not found for ${fqdn}`);
      const user = _host_data.user.address;

      await client
        .pipeline()
        .hset(Key.HOST_RECORDS_$HASH(body.net, fqdn, user), `text`, data.text)
        .sadd(Key.HOST_RECORDS_$SET(body.net, fqdn, user), `text`)
        .exec();

      break;
    }
    case EdnsEventType.UNSET_TEXT_RECORD: {
      const data: IUnsetTextRecordData = body.data;
      const fqdn = `${data.host}.${data.name}.${data.tld}`;

      const service = new EdnsV2FromRedisService();
      const _host_data = await service.getHost(fqdn);
      if (!_host_data?.user?.address) throw new Error(`User not found for ${fqdn}`);
      const user = _host_data.user.address;

      await client
        .pipeline()
        .hdel(Key.HOST_RECORDS_$HASH(body.net, fqdn, user), `text`)
        .srem(Key.HOST_RECORDS_$SET(body.net, fqdn, user), `text`)
        .exec();

      break;
    }
    case EdnsEventType.SET_TYPED_TEXT_RECORD: {
      const data: ISetTypedTextRecordData = body.data;
      const fqdn = `${data.host}.${data.name}.${data.tld}`;

      const service = new EdnsV2FromRedisService();
      const _host_data = await service.getHost(fqdn);
      if (!_host_data?.user?.address) throw new Error(`User not found for ${fqdn}`);
      const user = _host_data.user.address;

      try {
        await client
          .pipeline()
          .hset(Key.HOST_RECORDS_$HASH(body.net, fqdn, user), `typed_text:${data.type}`, data.text)
          .sadd(Key.HOST_RECORDS_$SET(body.net, fqdn, user), `typed_text:${data.type}`)
          .exec()
          .catch((error) => {
            console.log(error);
          });
        logger.info("Exec SET_TYPED_TEXT_RECORD");
        break;
      } catch (error) {
        console.log(error);
        break;
      }
    }
    case EdnsEventType.UNSET_TYPED_TEXT_RECORD: {
      const data: IUnsetTypedTextRecordData = body.data;
      const fqdn = `${data.host}.${data.name}.${data.tld}`;

      const service = new EdnsV2FromRedisService();
      const _host_data = await service.getHost(fqdn);
      if (!_host_data?.user?.address) throw new Error(`User not found for ${fqdn}`);
      const user = _host_data.user.address;

      try {
        await client
          .pipeline()
          .hdel(Key.HOST_RECORDS_$HASH(body.net, fqdn, user), `typed_text:${data.type}`)
          .srem(Key.HOST_RECORDS_$SET(body.net, fqdn, user), `typed_text:${data.type}`)
          .exec()
          .catch((error) => {
            console.log(error);
          });
        logger.info("Exec UNSET_TYPED_TEXT_RECORD");
        break;
      } catch (error) {
        console.log(error);
        break;
      }
    }
    case EdnsEventType.BRIDGE_REQUESTED: {
      const data: IBridgeRequestedData = body.data;
      const provider = createProvider(data.chainId);
      const contracts = EdnsContractsAddress.find((contract) => contract.chainId === data.chainId);
      if (contracts?.addresses["Bridge"]) {
        const bridge = Bridge__factory.connect(contracts?.addresses["Bridge"], provider);
        const req = await bridge.getBridgedRequest(data.ref);
        if (req) {
          const domain = `${req.name}.${req.tld}`;
          let batch = client.pipeline();
          const dels: string[] = [];
          // Remove all relative data about the host(s) under the domain
          const _hosts = await client.smembers(Key.DOMAIN_HOSTS_$SET(body.net, domain));
          if (_hosts.length) {
            for (const _host of _hosts) {
              const service = new EdnsV2FromRedisService();
              const _host_data = await service.getHost(body.fqdn);
              if (!_host_data?.user?.address) throw new Error(`User not found for ${body.fqdn}`);
              const _user = _host_data.user.address;

              dels.push(
                Key.HOST_RECORDS_$HASH(body.net, `${_host}.${domain}`, _user),
                Key.HOST_USER_$HASH(body.net, `${_host}.${domain}`),
                Key.HOST_OPERATORS_$SET(body.net, `${_host}.${domain}`),
              );
            }

            const queue: Promise<void>[] = [];
            for (const _host of _hosts) {
              async function exec(client: Redis): Promise<void> {
                const _operators = await client.smembers(Key.HOST_OPERATORS_$SET(body.net, `${_host}.${domain}`));
                if (_operators.length) {
                  _operators.forEach((operator) => {
                    batch = batch.srem(Key.ACCOUNT_HOST_OPERATORS_$SET(body.net, operator), `${_host}.${domain}`);
                  });
                }
              }
              queue.push(exec(client));
            }
            await Promise.all(queue);
          }
          const [owner, expiry] = await client.hmget(Key.DOMAIN_INFO_$HASH(body.net, domain), "owner", "expiry");
          if (owner && expiry) {
            batch = batch.hmset(Key.DOMAIN_USER_$HASH(body.net, domain), {
              user: owner,
              expiry: expiry,
            });
          }

          batch = batch.hset(Key.DOMAIN_INFO_$HASH(body.net, domain), "bridging", "1");
          batch = batch.sadd(Key.ACCOUNT_BRIDGE_REQUESTED_$SET(body.net, req.owner), data.ref);

          await batch.exec();
        }
      }
      break;
    }
    case EdnsEventType.BRIDGE_ACCEPTED: {
      const data: IBridgeAcceptedData = body.data;
      const provider = createProvider(data.chainId);
      const contracts = EdnsContractsAddress.find((contract) => contract.chainId === data.chainId);
      if (contracts?.addresses["Bridge"]) {
        const bridge = Bridge__factory.connect(contracts?.addresses["Bridge"], provider);
        const req = await bridge.getAcceptedRequest(data.ref);
        if (req) {
          const domain = `${req.name}.${req.tld}`;
          let batch = client.pipeline();
          batch = batch.hset(Key.DOMAIN_INFO_$HASH(body.net, domain), "chain", data.chainId);
          batch = batch.hdel(Key.DOMAIN_INFO_$HASH(body.net, domain), "bridging");
          batch = batch.sadd(Key.ACCOUNT_BRIDGE_ACCEPTED_$SET(body.net, req.owner), data.ref);
          await batch.exec();
        }
      }
      break;
    }
    case EdnsEventType.REVALIDATE: {
      const data: IRevalidateData = body.data;
      const domain = `${data.name}.${data.tld}`;
      console.debug({ data });
      // Domain Register
      const currentOwner = await client.hget(Key.DOMAIN_INFO_$HASH(body.net, domain), "owner");
      if (!currentOwner) {
        const service = new EdnsV2FromContractService();
        const [owner, expiry, ttl] = await Promise.all([
          service.getOwner(domain, { chainId: data.chainId }),
          service.getExpiry(domain, { chainId: data.chainId }),
          service.getTtl(domain, { chainId: data.chainId }),
        ]);
        if (owner && expiry) {
          await main({
            ...body,
            eventType: EdnsEventType.DOMAIN_REGISTERED,
            data: {
              chain: await getInContractChain(data.chainId),
              name: data.name,
              tld: data.tld,
              owner,
              expiry,
            },
          });
          await main({
            ...body,
            eventType: EdnsEventType.NEW_HOST,
            data: {
              host: data.host || "@",
              name: data.name,
              tld: data.tld,
              ttl,
            },
          });
        }
      }
      break;
    }
  }
};

export const index: SQSHandler = async (event, context) => {
  await setEnvironmentVariable();
  const records = event.Records;
  for (const record of records) {
    try {
      const body: IBody = JSON.parse(record.body);
      await main(body);
    } catch (err) {
      console.error(err);
    }
  }
};
