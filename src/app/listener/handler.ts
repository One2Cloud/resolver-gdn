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
import { IRegistry__factory } from "../../contracts/ethereum/edns-v2/typechain";
import { EdnsV2FromContractService } from "../../services/edns-v2.service";
import { extractFqdn } from "../../utils/extract-fqdn";
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
			const prevUser = await client.hget(`edns:${body.net}:domain:${domain}:info`, "owner");
			if (prevUser) {
				// Remove the domain from the previous owner
				batch = batch.srem(`edns:${body.net}:account:${data.owner}:domains`, domain);

				// Delete all of the previous domain record;
				dels.push(
					`edns:${body.net}:domain:${domain}:info`,
					`edns:${body.net}:domain:${domain}:user`,
					`edns:${body.net}:domain:${domain}:hosts`,
					`edns:${body.net}:domain:${domain}:operators`
				);

				// Removed the domain from the address relationship
				const operators = await client.smembers(`edns:${body.net}:domain:${domain}:operators`);
				if (operators.length) {
					operators.forEach((operator) => {
						batch = batch.srem(`edns:${body.net}:account:${operator}:domain:operators`, domain);
					});
				}

				// Remove all relative data about the host(s) under the domain
				const _hosts = await client.smembers(`edns:${body.net}:domain:${domain}:hosts`);
				if (_hosts.length) {
					dels.push(
						..._.flatten(
							_hosts.map((_host) => [
								`edns:${body.net}:host:${_host}.${domain}:records`,
								`edns:${body.net}:host:${_host}.${domain}:user`,
								`edns:${body.net}:host:${_host}.${domain}:operators`,
							])
						)
					);
					const queue: Promise<void>[] = [];
					for (const _host of _hosts) {
						async function exec(client: Redis): Promise<void> {
							const _operators = await client.smembers(`edns:${body.net}:host:${_host}.${domain}:operators`);
							if (_operators.length) {
								_operators.forEach((operator) => {
									batch = batch.srem(`edns:${body.net}:account:${operator}:host:operators`, `${_host}.${domain}`);
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

			// batch = batch.sadd(`edns:${body.net}:account:${data.owner}:domains`, domain);

			await batch
				.sadd(`edns:${body.net}:account:${data.owner}:domains`, domain)
				.hmset(`edns:${body.net}:domain:${domain}:info`, {
					owner: data.owner,
					expiry: data.expiry,
					chain: data.chain,
				})
				.hmset(`edns:${body.net}:domain:${domain}:user`, {
					user: data.owner,
					expiry: data.expiry,
				})
				.expireat(`edns:${body.net}:domain:${domain}:info`, data.expiry)
				.expireat(`edns:${body.net}:domain:${domain}:user`, data.expiry)
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
			const _hosts = await client.smembers(`edns:${body.net}:domain:${domain}:hosts`);
			if (_hosts.length) {
				_hosts.forEach((_host) => {
					batch = batch
						.expireat(`edns:${body.net}:host:${_host}.${domain}:records`, data.expiry)
						.expireat(`edns:${body.net}:host:${_host}.${domain}:user`, data.expiry)
						.expireat(`edns:${body.net}:host:${_host}.${domain}:operators`, data.expiry);
				});
			}

			// Update all the `EXPIRE` of the domain relative data
			batch = batch
				.hset(`edns:${body.net}:domain:${domain}:info`, "expiry", data.expiry)
				.hset(`edns:${body.net}:domain:${domain}:user`, "expiry", data.expiry)
				.expireat(`edns:${body.net}:domain:${domain}:info`, data.expiry)
				.expireat(`edns:${body.net}:domain:${domain}:user`, data.expiry);

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
		// 	const _hosts = await client.smembers(`edns:${body.net}:domain:${domain}:hosts`);
		// 	if (_hosts.length) {
		// 		dels.push(
		// 			..._.flatten(
		// 				_hosts.map((_host) => [
		// 					`edns:${body.net}:host:${_host}.${domain}:records`,
		// 					`edns:${body.net}:host:${_host}.${domain}:user`,
		// 					`edns:${body.net}:host:${_host}.${domain}:operators`,
		// 				])
		// 			)
		// 		);
		// 		const queue: Promise<void>[] = [];
		// 		for (const _host of _hosts) {
		// 			async function exec(client: Redis): Promise<void> {
		// 				const _operators = await client.smembers(`edns:${body.net}:host:${_host}.${domain}:operators`);
		// 				if (_operators.length) {
		// 					_operators.forEach((operator) => {
		// 						batch = batch.srem(`edns:${body.net}:account:${operator}:host:operators`, `${_host}.${domain}`);
		// 					});
		// 				}
		// 			}
		// 			queue.push(exec(client));
		// 		}
		// 		await Promise.all(queue);
		// 	}

		// 	const [owner, expiry] = await client.hmget(`edns:${body.net}:domain:${domain}:info`, "owner", "expiry");
		// 	if (owner && expiry) {
		// 		batch = batch.hmset(`edns:${body.net}:domain:${domain}:user`, { user: owner, expiry: expiry });
		// 	}

		// 	await batch.hset(`edns:${body.net}:domain:${domain}:info`, "chain", data.dstChain).exec();

		// 	break;
		// }
		case EdnsEventType.SET_DOMAIN_OWNER: {
			const data: ISetDomainOwner = body.data;
			const domain = `${data.name}.${data.tld}`;

			await client.hset(`edns:${body.net}:domain:${domain}:info`, "owner", data.newOwner);

			break;
		}
		case EdnsEventType.SET_DOMAIN_OPERATOR: {
			const data: ISetDomainOperatorData = body.data;
			const domain = `${data.name}.${data.tld}`;

			if (data.approved) {
				await client
					.pipeline()
					.sadd(`edns:${body.net}:domain:${domain}:operators`, data.operator)
					.sadd(`edns:${body.net}:account:${data.operator}:domain:operators`, domain)
					.exec();
			} else {
				await client
					.pipeline()
					.srem(`edns:${body.net}:domain:${domain}:operators`, data.operator)
					.srem(`edns:${body.net}:account:${data.operator}:domain:operators`, domain)
					.exec();
			}

			break;
		}
		case EdnsEventType.SET_DOMAIN_RESOLVER: {
			const data: ISetDomainResolverData = body.data;
			const domain = `${data.name}.${data.tld}`;
			await client.hmset(`edns:${body.net}:domain:${domain}:info`, {
				resolver: data.newResolver,
			});
			break;
		}
		case EdnsEventType.SET_DOMAIN_USER: {
			const data: ISetDomainUserData = body.data;
			const domain = `${data.name}.${data.tld}`;
			await client
				.pipeline()
				.hmset(`edns:${body.net}:domain:${domain}:user`, {
					user: data.newUser,
					expiry: data.expiry,
				})
				.expireat(`edns:${body.net}:domain:${domain}:user`, data.expiry)
				.exec();
			break;
		}
		case EdnsEventType.NEW_HOST: {
			const data: INewHostData = body.data;
			const domain = `${data.name}.${data.tld}`;
			let batch = client.pipeline();
			const [user, expiry] = await client.hmget(`edns:${body.net}:domain:${domain}:user`, "user", "expiry");
			if (user && expiry) {
				batch = batch.hmset(`edns:${body.net}:host:${data.host}.${domain}:user`, {
					user,
					expiry,
				});
			}
			await batch.sadd(`edns:${body.net}:domain:${domain}:host`, data.host).set(`edns:${body.net}:host:${data.host}.${domain}:ttl`, data.ttl).exec();
			break;
		}
		case EdnsEventType.REMOVE_HOST: {
			const data: IRemoveHostData = body.data;
			const domain = `${data.name}.${data.tld}`;
			await client
				.pipeline()
				.del(`edns:${body.net}:host:${data.host}.${domain}:user`)
				.srem(`edns:${body.net}:domain:${domain}:host`, data.host)
				.del(`edns:${body.net}:host:${data.host}.${domain}:ttl`)
				.exec();
			break;
		}
		case EdnsEventType.SET_HOST_OPERATOR: {
			const data: ISetHostOperatorData = body.data;
			const domain = `${data.name}.${data.tld}`;

			if (data.approved) {
				await client
					.pipeline()
					.sadd(`edns:${body.net}:host:${data.host}.${domain}:operators`, data.operator)
					.sadd(`edns:${body.net}:account:${data.operator}:host:operators`, `${data.host}.${domain}`)
					.exec();
			} else {
				await client
					.pipeline()
					.srem(`edns:${body.net}:host:${data.host}.${domain}:operators`, data.operator)
					.srem(`edns:${body.net}:account:${data.operator}:host:operators`, `${data.host}.${domain}`)
					.exec();
			}

			break;
		}
		case EdnsEventType.SET_HOST_USER: {
			const data: ISetHostUserData = body.data;
			const domain = `${data.name}.${data.tld}`;

			await client
				.hmset(`edns:${body.net}:host:${data.host}.${domain}:user`, {
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

			await client
				.pipeline()
				.set(`edns:${body.net}:account:${data.address}:reverse_domain`, fqdn)
				.sadd(`edns:${body.net}:host:${fqdn}:records:list`, "reverse_address")
				.exec()
				.catch((error) => {
					console.log(error);
				});
			logger.info("Exec SET_REVERSE_ADDRESS_RECORD");

			break;
		}
		case EdnsEventType.UNSET_REVERSE_ADDRESS_RECORD: {
			const data: IUnsetReverseAddressRecordData = body.data;
			const fqdn = `${data.host}.${data.name}.${data.tld}`;

			await client
				.pipeline()
				.del(`edns:${body.net}:account:${data.address}:reverse_domain`)
				.srem(`edns:${body.net}:host:${fqdn}:records:list`, "reverse_address")
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

			await client.pipeline().hset(`edns:${body.net}:host:${fqdn}:records`, "address", data.address).sadd(`edns:${body.net}:host:${fqdn}:records:list`, "address").exec();

			break;
		}
		case EdnsEventType.UNSET_ADDRESS_RECORD: {
			const data: IUnsetAddressRecordData = body.data;
			const fqdn = `${data.host}.${data.name}.${data.tld}`;

			await client.pipeline().hdel(`edns:${body.net}:host:${fqdn}:records`, "address").srem(`edns:${body.net}:host:${fqdn}:records:list`, "address").exec();

			break;
		}
		case EdnsEventType.SET_MULTI_COIN_ADDRESS_RECORD: {
			const data: ISetMultiCoinAddressRecordData = body.data;
			const fqdn = `${data.host}.${data.name}.${data.tld}`;

			await client
				.pipeline()
				.hset(`edns:${body.net}:host:${fqdn}:records`, `multi_coin_address:${data.coin}`, data.address)
				.sadd(`edns:${body.net}:host:${fqdn}:records:list`, `multi_coin_address:${data.coin}`)
				.exec();

			break;
		}
		case EdnsEventType.UNSET_MULTI_COIN_ADDRESS_RECORD: {
			const data: IUnsetMultiCoinAddressRecordData = body.data;
			const fqdn = `${data.host}.${data.name}.${data.tld}`;

			await client
				.pipeline()
				.hdel(`edns:${body.net}:host:${fqdn}:records`, `multi_coin_address:${data.coin}`)
				.srem(`edns:${body.net}:host:${fqdn}:records:list`, `multi_coin_address:${data.coin}`)
				.exec();

			break;
		}
		case EdnsEventType.SET_NFT_RECORD: {
			const data: ISetNftRecordData = body.data;
			const fqdn = `${data.host}.${data.name}.${data.tld}`;

			await client
				.pipeline()
				.hset(`edns:${body.net}:host:${fqdn}:records`, `nft:${data.chainId}`, `${data.contractAddress}:${data.tokenId}`)
				.sadd(`edns:${body.net}:host:${fqdn}:records:list`, `nft:${data.chainId}`)
				.exec();

			break;
		}
		case EdnsEventType.UNSET_NFT_RECORD: {
			const data: IUnsetNftRecordData = body.data;
			const fqdn = `${data.host}.${data.name}.${data.tld}`;

			await client.pipeline().hdel(`edns:${body.net}:host:${fqdn}:records`, `nft:${data.chainId}`).srem(`edns:${body.net}:host:${fqdn}:records:list`, `nft:${data.chainId}`).exec();

			break;
		}
		case EdnsEventType.SET_TEXT_RECORD: {
			const data: ISetTextRecordData = body.data;
			const fqdn = `${data.host}.${data.name}.${data.tld}`;

			await client.pipeline().hset(`edns:${body.net}:host:${fqdn}:records`, `text`, data.text).sadd(`edns:${body.net}:host:${fqdn}:records:list`, `text`).exec();

			break;
		}
		case EdnsEventType.UNSET_TEXT_RECORD: {
			const data: IUnsetTextRecordData = body.data;
			const fqdn = `${data.host}.${data.name}.${data.tld}`;

			await client.pipeline().hdel(`edns:${body.net}:host:${fqdn}:records`, `text`).srem(`edns:${body.net}:host:${fqdn}:records:list`, `text`).exec();

			break;
		}
		case EdnsEventType.SET_TYPED_TEXT_RECORD: {
			const data: ISetTypedTextRecordData = body.data;
			const fqdn = `${data.host}.${data.name}.${data.tld}`;
			try {
				await client
					.pipeline()
					.hset(`edns:${body.net}:host:${fqdn}:records`, `typed_text:${data.type}`, data.text)
					.sadd(`edns:${body.net}:host:${fqdn}:records:list`, `typed_text:${data.type}`)
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
			try {
				await client
					.pipeline()
					.hdel(`edns:${body.net}:host:${fqdn}:records`, `typed_text:${data.type}`)
					.srem(`edns:${body.net}:host:${fqdn}:records:list`, `typed_text:${data.type}`)
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
					const _hosts = await client.smembers(`edns:${body.net}:domain:${domain}:hosts`);
					if (_hosts.length) {
						dels.push(
							..._.flatten(
								_hosts.map((_host) => [
									`edns:${body.net}:host:${_host}.${domain}:records`,
									`edns:${body.net}:host:${_host}.${domain}:user`,
									`edns:${body.net}:host:${_host}.${domain}:operators`,
								])
							)
						);
						const queue: Promise<void>[] = [];
						for (const _host of _hosts) {
							async function exec(client: Redis): Promise<void> {
								const _operators = await client.smembers(`edns:${body.net}:host:${_host}.${domain}:operators`);
								if (_operators.length) {
									_operators.forEach((operator) => {
										batch = batch.srem(`edns:${body.net}:account:${operator}:host:operators`, `${_host}.${domain}`);
									});
								}
							}
							queue.push(exec(client));
						}
						await Promise.all(queue);
					}
					const [owner, expiry] = await client.hmget(`edns:${body.net}:domain:${domain}:info`, "owner", "expiry");
					if (owner && expiry) {
						batch = batch.hmset(`edns:${body.net}:domain:${domain}:user`, {
							user: owner,
							expiry: expiry,
						});
					}

					batch = batch.hset(`edns:${body.net}:domain:${domain}:info`, "bridging", "1");
					batch = batch.sadd(`edns:${body.net}:account:${req.owner}:bridge:requested`, data.ref);

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
					batch = batch.hset(`edns:${body.net}:domain:${domain}:info`, "chain", data.chainId);
					batch = batch.hdel(`edns:${body.net}:domain:${domain}:info`, "bridging");
					batch = batch.sadd(`edns:${body.net}:account:${req.owner}:bridge:accepted`, data.ref);
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
			const currentOwner = await client.hget(`edns:${body.net}:domain:${domain}:info`, "owner");
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
