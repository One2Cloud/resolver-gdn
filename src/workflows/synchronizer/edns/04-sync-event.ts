import "source-map-support/register";
import { Handler } from "aws-lambda";
import { JsonRpcProvider, WebSocketProvider } from "@ethersproject/providers";
import { PublicResolver__factory, Registrar__factory, IRegistry__factory, Bridge__factory } from "../../../contracts/ethereum/edns-v2/typechain";
import ContractAddresses from "../../../static/edns-contracts-address.json";
import { ethers } from "ethers";
import { createLogger } from "../../../utils/create-logger";
import { setEnvironmentVariable } from "../../../utils/set-environment-variable";
import { getNetworkConfig } from "../../../network-config";
import { EdnsEventType } from "../../../constants/event-type.constant";
import { getInContractChain } from "../../../utils/get-in-contract-chain";
import { DomainProvider } from "../../../constants/domain-provider.constant";
import { putSqsMessage } from "../../../utils/put-sqs-message";
import { Net } from "../../../network-config";

const logger = createLogger({ service: "workflow/edns/03-sync-event" });

interface Input {
	chainId: number;
	eventType: string;
	from: number;
	to: number;
	net: Net;
}

export const index: Handler<Input> = async (input) => {
	await setEnvironmentVariable();
	const NetworkConfig = await getNetworkConfig();
	const networkConfig = NetworkConfig[input.chainId];
	if (!networkConfig) throw new Error("NetworkCOnfig is missing");
	let provider: JsonRpcProvider | WebSocketProvider | undefined;

	if (networkConfig.url.startsWith("http")) {
		provider = new JsonRpcProvider(networkConfig.url, {
			name: networkConfig.name,
			chainId: networkConfig.chainId,
		});
	} else if (networkConfig.url.startsWith("ws")) {
		provider = new WebSocketProvider(networkConfig.url, {
			name: networkConfig.name,
			chainId: networkConfig.chainId,
		});
	}

	if (!provider) throw new Error("Provider is missing"); // TODO:

	let synced = 0;

	const contractAddresses = ContractAddresses.find((contract) => contract.chainId === input.chainId);
	if (contractAddresses?.addresses["Registry.Diamond"] && contractAddresses?.addresses["Registrar"] && contractAddresses?.addresses["PublicResolver"]) {
		const contracts = {
			resolver: PublicResolver__factory.connect(contractAddresses.addresses["PublicResolver"], provider),
			registrar: Registrar__factory.connect(contractAddresses.addresses["Registrar"], provider),
			registry: IRegistry__factory.connect(contractAddresses.addresses["Registry.Diamond"], provider),
			bridge: contractAddresses.addresses["Bridge"] ? Bridge__factory.connect(contractAddresses.addresses["Bridge"], provider) : undefined,
		};

		const eventType = <EdnsEventType>input.eventType;
		logger.info(`Received event type: ${eventType}`);

		switch (eventType) {
			case EdnsEventType.DOMAIN_REGISTERED: {
				const filter = contracts.registrar.filters["DomainRegistered"]();
				const events = await contracts.registrar.queryFilter(filter, input.from, input.to);
				synced = events.length;
				for (const event of events) {
					const { name, tld, owner, expiry } = event.args;
					const _name = ethers.utils.toUtf8String(name);
					const _tld = ethers.utils.toUtf8String(tld);
					const fqdn = `${_name}.${_tld}`;
					await putSqsMessage({
						chainId: input.chainId,
						provider: DomainProvider.EDNS,
						eventType,
						fqdn,
						net: input.net,
						data: {
							name: _name,
							tld: _tld,
							owner,
							expiry: expiry.toString(),
							chain: await getInContractChain(input.chainId),
						},
					});
				}
				break;
			}
			case EdnsEventType.DOMAIN_RENEWED: {
				const filter = contracts.registrar.filters["DomainRenewed"]();
				const events = await contracts.registrar.queryFilter(filter, input.from, input.to);
				synced = events.length;
				for (const event of events) {
					const { name, tld, expiry } = event.args;
					const _name = ethers.utils.toUtf8String(name);
					const _tld = ethers.utils.toUtf8String(tld);
					const fqdn = `${_name}.${_tld}`;
					await putSqsMessage({
						chainId: input.chainId,
						provider: DomainProvider.EDNS,
						eventType,
						fqdn,
						net: input.net,
						data: {
							name: _name,
							tld: _tld,
							expiry: expiry.toString(),
						},
					});
				}
				break;
			}
			case EdnsEventType.SET_DOMAIN_OWNER: {
				const filter = contracts.registry.filters["SetDomainOwner"]();
				const events = await contracts.registry.queryFilter(filter, input.from, input.to);
				synced = events.length;
				for (const event of events) {
					const { name, tld, owner: newOwner } = event.args;
					const [_name, _tld] = await Promise.all([contracts.registry["getName(bytes32,bytes32)"](name, tld), contracts.registry["getName(bytes32)"](tld)]);
					const __name = ethers.utils.toUtf8String(_name);
					const __tld = ethers.utils.toUtf8String(_tld);
					const fqdn = `${__name}.${__tld}`;
					await putSqsMessage({
						chainId: input.chainId,
						provider: DomainProvider.EDNS,
						eventType,
						fqdn,
						net: input.net,
						data: {
							name: __name,
							tld: __tld,
							newOwner,
						},
					});
				}
				break;
			}
			case EdnsEventType.SET_DOMAIN_RESOLVER: {
				const filter = contracts.registry.filters["SetDomainResolver"]();
				const events = await contracts.registry.queryFilter(filter, input.from, input.to);
				synced = events.length;
				for (const event of events) {
					const { name, tld, newResolver } = event.args;
					const [_name, _tld] = await Promise.all([contracts.registry["getName(bytes32,bytes32)"](name, tld), contracts.registry["getName(bytes32)"](tld)]);
					const __name = ethers.utils.toUtf8String(_name);
					const __tld = ethers.utils.toUtf8String(_tld);
					const fqdn = `${__name}.${__tld}`;
					await putSqsMessage({
						chainId: input.chainId,
						provider: DomainProvider.EDNS,
						eventType,
						fqdn,
						net: input.net,
						data: {
							name: __name,
							tld: __tld,
							newResolver,
						},
					});
				}
				break;
			}
			case EdnsEventType.SET_DOMAIN_OPERATOR: {
				const filter = contracts.registry.filters["SetDomainOperator"]();
				const events = await contracts.registry.queryFilter(filter, input.from, input.to);
				synced = events.length;
				for (const event of events) {
					const { name, tld, operator, approved } = event.args;
					const [_name, _tld] = await Promise.all([contracts.registry["getName(bytes32,bytes32)"](name, tld), contracts.registry["getName(bytes32)"](tld)]);
					const __name = ethers.utils.toUtf8String(_name);
					const __tld = ethers.utils.toUtf8String(_tld);
					const fqdn = `${__name}.${__tld}`;
					await putSqsMessage({
						chainId: input.chainId,
						provider: DomainProvider.EDNS,
						eventType,
						fqdn,
						net: input.net,
						data: {
							name: __name,
							tld: __tld,
							operator,
							approved,
						},
					});
				}
				break;
			}
			case EdnsEventType.SET_DOMAIN_USER: {
				const filter = contracts.registry.filters["SetDomainUser"]();
				const events = await contracts.registry.queryFilter(filter, input.from, input.to);
				synced = events.length;
				for (const event of events) {
					const { name, tld, newUser, expiry } = event.args;
					const [_name, _tld] = await Promise.all([contracts.registry["getName(bytes32,bytes32)"](name, tld), contracts.registry["getName(bytes32)"](tld)]);
					const __name = ethers.utils.toUtf8String(_name);
					const __tld = ethers.utils.toUtf8String(_tld);
					const fqdn = `${__name}.${__tld}`;
					await putSqsMessage({
						chainId: input.chainId,
						provider: DomainProvider.EDNS,
						eventType,
						fqdn,
						net: input.net,
						data: {
							name: __name,
							tld: __tld,
							newUser,
							expiry: expiry.toString(),
						},
					});
				}
				break;
			}
			case EdnsEventType.NEW_HOST: {
				const filter = contracts.registry.filters["NewHost"]();
				const events = await contracts.registry.queryFilter(filter, input.from, input.to);
				synced = events.length;
				for (const event of events) {
					const { host, name, tld, ttl } = event.args;
					const _host = ethers.utils.toUtf8String(host);
					const _name = ethers.utils.toUtf8String(name);
					const _tld = ethers.utils.toUtf8String(tld);
					const fqdn = `${_host}.${_name}.${_tld}`;
					await putSqsMessage({
						chainId: input.chainId,
						provider: DomainProvider.EDNS,
						eventType,
						fqdn,
						net: input.net,
						data: {
							host: _host,
							name: _name,
							tld: _tld,
							ttl,
						},
					});
				}
				break;
			}
			case EdnsEventType.REMOVE_HOST: {
				const filter = contracts.registry.filters["RemoveHost"]();
				const events = await contracts.registry.queryFilter(filter, input.from, input.to);
				synced = events.length;
				for (const event of events) {
					const { host, name, tld } = event.args;
					const _host = ethers.utils.toUtf8String(host);
					const _name = ethers.utils.toUtf8String(name);
					const _tld = ethers.utils.toUtf8String(tld);
					const fqdn = `${_host}.${_name}.${_tld}`;
					await putSqsMessage({
						chainId: input.chainId,
						provider: DomainProvider.EDNS,
						eventType,
						fqdn,
						net: input.net,
						data: {
							host: _host,
							name: _name,
							tld: _tld,
						},
					});
				}
				break;
			}
			case EdnsEventType.SET_HOST_OPERATOR: {
				const filter = contracts.registry.filters["SetHostOperator"]();
				const events = await contracts.registry.queryFilter(filter, input.from, input.to);
				synced = events.length;
				for (const event of events) {
					const { host, name, tld, operator, approved } = event.args;
					const [_host, _name, _tld] = await Promise.all([
						contracts.registry["getName(bytes32,bytes32,bytes32)"](host, name, tld),
						contracts.registry["getName(bytes32,bytes32)"](name, tld),
						contracts.registry["getName(bytes32)"](tld),
					]);
					const __host = ethers.utils.toUtf8String(_host);
					const __name = ethers.utils.toUtf8String(_name);
					const __tld = ethers.utils.toUtf8String(_tld);
					const fqdn = `${__host}.${__name}.${__tld}`;
					await putSqsMessage({
						chainId: input.chainId,
						provider: DomainProvider.EDNS,
						eventType,
						fqdn,
						net: input.net,
						data: {
							host: __host,
							name: __name,
							tld: __tld,
							operator,
							approved,
						},
					});
				}
				break;
			}
			case EdnsEventType.BRIDGE_REQUESTED: {
				if (contracts.bridge) {
					const filter = contracts.bridge.filters["Bridged"]();
					const events = await contracts.bridge.queryFilter(filter, input.from, input.to);
					synced = events.length;
					for (const event of events) {
						const { nonce, sender, ref } = event.args;
						const hash = event.transactionHash;
						try {
							const data = await contracts.bridge.getBridgedRequest(ref);
							const fqdn = `${data.name}.${data.tld}`;
							await putSqsMessage({
								chainId: input.chainId,
								provider: DomainProvider.EDNS,
								eventType,
								fqdn,
								hash,
								net: input.net,
								data: { ref, nonce, sender },
							});
						} catch {
							//
						}
					}
				}
				break;
			}
			case EdnsEventType.BRIDGE_ACCEPTED: {
				if (contracts.bridge) {
					const filter = contracts.bridge.filters["Accepted"]();
					const events = await contracts.bridge.queryFilter(filter, input.from, input.to);
					synced = events.length;
					for (const event of events) {
						const { nonce, sender, ref } = event.args;
						const hash = event.transactionHash;
						try {
							const data = await contracts.bridge.getAcceptedRequest(ref);
							const fqdn = `${data.name}.${data.tld}`;
							await putSqsMessage({
								chainId: input.chainId,
								provider: DomainProvider.EDNS,
								eventType,
								fqdn,
								hash,
								net: input.net,
								data: { ref, nonce, sender },
							});
						} catch {
							//
						}
					}
				}
				break;
			}
			case EdnsEventType.SET_ADDRESS_RECORD: {
				const filter = contracts.resolver.filters["SetAddress"]();
				const events = await contracts.resolver.queryFilter(filter, input.from, input.to);
				synced = events.length;
				for (const event of events) {
					const { host, name, tld, address_ } = event.args;
					const _host = ethers.utils.toUtf8String(host);
					const _name = ethers.utils.toUtf8String(name);
					const _tld = ethers.utils.toUtf8String(tld);
					const fqdn = `${_host}.${_name}.${_tld}`;
					const hash = event.transactionHash;
					await putSqsMessage({
						chainId: input.chainId,
						provider: DomainProvider.EDNS,
						eventType,
						fqdn,
						hash,
						net: input.net,
						data: {
							host: _host,
							name: _name,
							tld: _tld,
							address: address_,
						},
					});
				}
				break;
			}
			case EdnsEventType.UNSET_ADDRESS_RECORD: {
				const filter = contracts.resolver.filters["UnsetAddress"]();
				const events = await contracts.resolver.queryFilter(filter, input.from, input.to);
				synced = events.length;
				for (const event of events) {
					const { host, name, tld } = event.args;
					const _host = ethers.utils.toUtf8String(host);
					const _name = ethers.utils.toUtf8String(name);
					const _tld = ethers.utils.toUtf8String(tld);
					const fqdn = `${_host}.${_name}.${_tld}`;
					const hash = event.transactionHash;
					await putSqsMessage({
						chainId: input.chainId,
						provider: DomainProvider.EDNS,
						eventType,
						fqdn,
						hash,
						net: input.net,
						data: {
							host: _host,
							name: _name,
							tld: _tld,
						},
					});
				}
				break;
			}
			case EdnsEventType.SET_MULTI_COIN_ADDRESS_RECORD: {
				const filter = contracts.resolver.filters["SetMultiCoinAddress"]();
				const events = await contracts.resolver.queryFilter(filter, input.from, input.to);
				synced = events.length;
				for (const event of events) {
					const { host, name, tld, coin, address_ } = event.args;
					const _host = ethers.utils.toUtf8String(host);
					const _name = ethers.utils.toUtf8String(name);
					const _tld = ethers.utils.toUtf8String(tld);
					const _coin = coin.toNumber();
					const fqdn = `${_host}.${_name}.${_tld}`;
					const hash = event.transactionHash;
					await putSqsMessage({
						chainId: input.chainId,
						provider: DomainProvider.EDNS,
						eventType,
						fqdn,
						hash,
						net: input.net,
						data: {
							host: _host,
							name: _name,
							tld: _tld,
							coin: _coin,
							address: address_,
						},
					});
				}
				break;
			}
			case EdnsEventType.UNSET_MULTI_COIN_ADDRESS_RECORD: {
				const filter = contracts.resolver.filters["UnsetMultiCoinAddress"]();
				const events = await contracts.resolver.queryFilter(filter, input.from, input.to);
				synced = events.length;
				for (const event of events) {
					const { host, name, tld, coin } = event.args;
					const _host = ethers.utils.toUtf8String(host);
					const _name = ethers.utils.toUtf8String(name);
					const _tld = ethers.utils.toUtf8String(tld);
					const fqdn = `${_host}.${_name}.${_tld}`;
					const hash = event.transactionHash;
					await putSqsMessage({
						chainId: input.chainId,
						provider: DomainProvider.EDNS,
						eventType,
						fqdn,
						hash,
						net: input.net,
						data: {
							host: _host,
							name: _name,
							tld: _tld,
							coin,
						},
					});
				}
				break;
			}
			case EdnsEventType.SET_TEXT_RECORD: {
				const filter = contracts.resolver.filters["SetText"]();
				const events = await contracts.resolver.queryFilter(filter, input.from, input.to);
				synced = events.length;
				for (const event of events) {
					const { host, name, tld, text } = event.args;
					const _host = ethers.utils.toUtf8String(host);
					const _name = ethers.utils.toUtf8String(name);
					const _tld = ethers.utils.toUtf8String(tld);
					const hash = event.transactionHash;
					const fqdn = `${_host}.${_name}.${_tld}`;
					await putSqsMessage({
						chainId: input.chainId,
						provider: DomainProvider.EDNS,
						eventType,
						fqdn,
						hash,
						net: input.net,
						data: {
							host: _host,
							name: _name,
							tld: _tld,
							text,
						},
					});
				}
				break;
			}
			case EdnsEventType.UNSET_TEXT_RECORD: {
				const filter = contracts.resolver.filters["UnsetText"]();
				const events = await contracts.resolver.queryFilter(filter, input.from, input.to);
				synced = events.length;
				for (const event of events) {
					const { host, name, tld } = event.args;
					const _host = ethers.utils.toUtf8String(host);
					const _name = ethers.utils.toUtf8String(name);
					const _tld = ethers.utils.toUtf8String(tld);
					const hash = event.transactionHash;
					const fqdn = `${_host}.${_name}.${_tld}`;
					await putSqsMessage({
						chainId: input.chainId,
						provider: DomainProvider.EDNS,
						eventType,
						fqdn,
						hash,
						net: input.net,
						data: {
							host: _host,
							name: _name,
							tld: _tld,
						},
					});
				}
				break;
			}
			case EdnsEventType.SET_TYPED_TEXT_RECORD: {
				const filter = contracts.resolver.filters["SetTypedText"]();
				const events = await contracts.resolver.queryFilter(filter, input.from, input.to);
				synced = events.length;
				for (const event of events) {
					const { host, name, tld, type_, text } = event.args;
					const _host = ethers.utils.toUtf8String(host);
					const _name = ethers.utils.toUtf8String(name);
					const _tld = ethers.utils.toUtf8String(tld);
					const _type_ = ethers.utils.toUtf8String(type_);
					const hash = event.transactionHash;
					const fqdn = `${_host}.${_name}.${_tld}`;
					await putSqsMessage({
						chainId: input.chainId,
						provider: DomainProvider.EDNS,
						eventType,
						fqdn,
						hash,
						net: input.net,
						data: {
							host: _host,
							name: _name,
							tld: _tld,
							type: _type_,
							text,
						},
					});
				}
				break;
			}
			case EdnsEventType.UNSET_TYPED_TEXT_RECORD: {
				const filter = contracts.resolver.filters["UnsetTypedText"]();
				const events = await contracts.resolver.queryFilter(filter, input.from, input.to);
				synced = events.length;
				for (const event of events) {
					const { host, name, tld, type_ } = event.args;
					const _host = ethers.utils.toUtf8String(host);
					const _name = ethers.utils.toUtf8String(name);
					const _tld = ethers.utils.toUtf8String(tld);
					const _type_ = ethers.utils.toUtf8String(type_);
					const hash = event.transactionHash;
					const fqdn = `${_host}.${_name}.${_tld}`;
					await putSqsMessage({
						chainId: input.chainId,
						provider: DomainProvider.EDNS,
						eventType,
						fqdn,
						hash,
						net: input.net,
						data: {
							host: _host,
							name: _name,
							tld: _tld,
							type: _type_,
						},
					});
				}
				break;
			}
			case EdnsEventType.SET_NFT_RECORD: {
				const filter = contracts.resolver.filters["SetNFT"]();
				const events = await contracts.resolver.queryFilter(filter, input.from, input.to);
				synced = events.length;
				for (const event of events) {
					const { host, name, tld, chainId, contractAddress, tokenId } = event.args;
					const _host = ethers.utils.toUtf8String(host);
					const _name = ethers.utils.toUtf8String(name);
					const _tld = ethers.utils.toUtf8String(tld);
					const _chainId = chainId.toNumber();
					const _tokenId = tokenId.toNumber();
					const fqdn = `${_host}.${_name}.${_tld}`;
					const hash = event.transactionHash;
					await putSqsMessage({
						chainId: input.chainId,
						provider: DomainProvider.EDNS,
						eventType,
						fqdn,
						hash,
						net: input.net,
						data: {
							host: _host,
							name: _name,
							tld: _tld,
							chainId: _chainId,
							contractAddress,
							tokenId: _tokenId,
						},
					});
				}
				break;
			}
			case EdnsEventType.UNSET_NFT_RECORD: {
				const filter = contracts.resolver.filters["UnsetNFT"]();
				const events = await contracts.resolver.queryFilter(filter, input.from, input.to);
				synced = events.length;
				for (const event of events) {
					const { host, name, tld, chainId } = event.args;
					const _host = ethers.utils.toUtf8String(host);
					const _name = ethers.utils.toUtf8String(name);
					const _tld = ethers.utils.toUtf8String(tld);
					const _chainId = chainId.toNumber();
					const fqdn = `${_host}.${_name}.${_tld}`;
					const hash = event.transactionHash;
					await putSqsMessage({
						chainId: input.chainId,
						provider: DomainProvider.EDNS,
						eventType,
						fqdn,
						hash,
						net: input.net,
						data: {
							host: _host,
							name: _name,
							tld: _tld,
							chainId: _chainId,
						},
					});
				}
				break;
			}
			case EdnsEventType.SET_REVERSE_ADDRESS_RECORD: {
				const filter = contracts.resolver.filters["SetReverseAddress"]();
				const events = await contracts.resolver.queryFilter(filter, input.from, input.to);
				synced = events.length;
				for (const event of events) {
					const { host, name, tld, address_ } = event.args;
					const _host = ethers.utils.toUtf8String(host);
					const _name = ethers.utils.toUtf8String(name);
					const _tld = ethers.utils.toUtf8String(tld);
					const fqdn = `${_host}.${_name}.${_tld}`;
					const hash = event.transactionHash;
					await putSqsMessage({
						chainId: input.chainId,
						provider: DomainProvider.EDNS,
						eventType,
						fqdn,
						hash,
						net: input.net,
						data: {
							host: _host,
							name: _name,
							tld: _tld,
							address: address_,
						},
					});
				}
				break;
			}
			case EdnsEventType.UNSET_REVERSE_ADDRESS_RECORD: {
				const filter = contracts.resolver.filters["UnsetReverseAddress"]();
				const events = await contracts.resolver.queryFilter(filter, input.from, input.to);
				synced = events.length;
				for (const event of events) {
					const { host, name, tld, address_ } = event.args;
					const _host = ethers.utils.toUtf8String(host);
					const _name = ethers.utils.toUtf8String(name);
					const _tld = ethers.utils.toUtf8String(tld);
					const fqdn = `${_host}.${_name}.${_tld}`;
					const hash = event.transactionHash;
					await putSqsMessage({
						chainId: input.chainId,
						provider: DomainProvider.EDNS,
						eventType,
						fqdn,
						hash,
						net: input.net,
						data: {
							host: _host,
							name: _name,
							tld: _tld,
							address: address_,
						},
					});
				}
				break;
			}
		}
	}
	return synced;
};

// index({
// 	"chainId": 5,
// 	"from": 9634426,
// 	"to": 9634427,
// 	"eventType": "domain-registered",
// 	"net": "testnet"
//   })
