import "source-map-support/register";
import { Handler } from "aws-lambda";
import { EdnsEventType } from "../../constants/event-type.constant";
import { createLogger } from "../../utils/create-logger";
import NetworkConfig from "../../ethereum-network-config";
import { JsonRpcProvider, WebSocketProvider } from "@ethersproject/providers";
import { PublicResolver__factory, Registrar__factory, IRegistry__factory } from "../../contracts/ethereum/edns-v2";
import ContractAddresses from "../../../static/edns-contracts-address.json";
import { putEvent } from "../../utils/put-event";
import { DomainProvider } from "../../constants/domain-provider.constant";
import { ethers } from "ethers";

const logger = createLogger({ service: "workflow/edns/03-sync-event" });

interface Input {
	chainId: number;
	eventType: string;
	from: number;
	to: number;
}

export const index: Handler<Input> = async (input) => {
	const networkConfig = NetworkConfig[input.chainId];
	if (!networkConfig) throw new Error("NetworkCOnfig is missing");
	let provider: JsonRpcProvider | WebSocketProvider | undefined;

	if (networkConfig.url.startsWith("http")) {
		provider = new JsonRpcProvider(networkConfig.url, { name: networkConfig.name, chainId: networkConfig.chainId });
	} else if (networkConfig.url.startsWith("ws")) {
		provider = new WebSocketProvider(networkConfig.url, { name: networkConfig.name, chainId: networkConfig.chainId });
	}

	if (!provider) throw new Error("Provider is missing"); // TODO:

	const contractAddresses = ContractAddresses.find((contract) => contract.chainId === input.chainId);
	if (contractAddresses?.addresses["Registry.Diamond"] && contractAddresses?.addresses["Registrar"] && contractAddresses?.addresses["PublicResolver"]) {
		const contracts = {
			resolver: PublicResolver__factory.connect(contractAddresses.addresses["PublicResolver"], provider),
			registrar: Registrar__factory.connect(contractAddresses.addresses["Registrar"], provider),
			registry: IRegistry__factory.connect(contractAddresses.addresses["Registry.Diamond"], provider),
		};

		const eventType = <EdnsEventType>input.eventType;
		logger.info(`Received event type: ${eventType}`);

		switch (eventType) {
			case EdnsEventType.DOMAIN_REGISTERED: {
				const filter = contracts.registrar.filters["DomainRegistered"]();
				const events = await contracts.registrar.queryFilter(filter, input.from, input.to);
				for (const event of events) {
					const { name, tld, owner, expiry } = event.args;
					const _name = ethers.utils.toUtf8String(name);
					const _tld = ethers.utils.toUtf8String(tld);
					const fqdn = `${_name}.${_tld}`;
					await putEvent(input.chainId, DomainProvider.EDNS, fqdn, eventType, {
						name,
						tld,
						owner,
						expiry: expiry.toString(),
					});
				}
				break;
			}
			case EdnsEventType.DOMAIN_RENEWED: {
				const filter = contracts.registrar.filters["DomainRenewed"]();
				const events = await contracts.registrar.queryFilter(filter, input.from, input.to);
				for (const event of events) {
					const { name, tld, expiry } = event.args;
					const _name = ethers.utils.toUtf8String(name);
					const _tld = ethers.utils.toUtf8String(tld);
					const fqdn = `${_name}.${_tld}`;
					await putEvent(input.chainId, DomainProvider.EDNS, fqdn, eventType, {
						name,
						tld,
						expiry: expiry.toString(),
					});
				}
				break;
			}
			case EdnsEventType.SET_DOMAIN_OWNER: {
				const filter = contracts.registry.filters["SetDomainOwner"]();
				const events = await contracts.registry.queryFilter(filter, input.from, input.to);
				for (const event of events) {
					const { name, tld, owner: newOwner } = event.args;
					const [_name, _tld] = await Promise.all([contracts.registry["getName(bytes32,bytes32)"](name, tld), contracts.registry["getName(bytes32)"](tld)]);
					const __name = ethers.utils.toUtf8String(name);
					const __tld = ethers.utils.toUtf8String(tld);
					const fqdn = `${_name}.${_tld}`;
					await putEvent(input.chainId, DomainProvider.EDNS, fqdn, eventType, {
						name: __name,
						tld: __tld,
						newOwner,
					});
				}
				break;
			}
			case EdnsEventType.SET_DOMAIN_RESOLVER: {
				const filter = contracts.registry.filters["SetDomainResolver"]();
				const events = await contracts.registry.queryFilter(filter, input.from, input.to);
				for (const event of events) {
					const { name, tld, newResolver } = event.args;
					const [_name, _tld] = await Promise.all([contracts.registry["getName(bytes32,bytes32)"](name, tld), contracts.registry["getName(bytes32)"](tld)]);
					const __name = ethers.utils.toUtf8String(name);
					const __tld = ethers.utils.toUtf8String(tld);
					const fqdn = `${_name}.${_tld}`;
					await putEvent(input.chainId, DomainProvider.EDNS, fqdn, eventType, {
						name: __name,
						tld: __tld,
						newResolver,
					});
				}
				break;
			}
			case EdnsEventType.SET_DOMAIN_OPERATOR: {
				const filter = contracts.registry.filters["SetDomainOperator"]();
				const events = await contracts.registry.queryFilter(filter, input.from, input.to);
				for (const event of events) {
					const { name, tld, operator, approved } = event.args;
					const [_name, _tld] = await Promise.all([contracts.registry["getName(bytes32,bytes32)"](name, tld), contracts.registry["getName(bytes32)"](tld)]);
					const __name = ethers.utils.toUtf8String(name);
					const __tld = ethers.utils.toUtf8String(tld);
					const fqdn = `${_name}.${_tld}`;
					await putEvent(input.chainId, DomainProvider.EDNS, fqdn, eventType, {
						name: __name,
						tld: __tld,
						operator,
						approved,
					});
				}
				break;
			}
			case EdnsEventType.SET_DOMAIN_USER: {
				const filter = contracts.registry.filters["SetDomainUser"]();
				const events = await contracts.registry.queryFilter(filter, input.from, input.to);
				for (const event of events) {
					const { name, tld, newUser, expiry } = event.args;
					const [_name, _tld] = await Promise.all([contracts.registry["getName(bytes32,bytes32)"](name, tld), contracts.registry["getName(bytes32)"](tld)]);
					const __name = ethers.utils.toUtf8String(name);
					const __tld = ethers.utils.toUtf8String(tld);
					const fqdn = `${_name}.${_tld}`;
					await putEvent(input.chainId, DomainProvider.EDNS, fqdn, eventType, {
						name: __name,
						tld: __tld,
						newUser,
						expiry: expiry.toString(),
					});
				}
				break;
			}
			case EdnsEventType.NEW_HOST: {
				const filter = contracts.registry.filters["NewHost"]();
				const events = await contracts.registry.queryFilter(filter, input.from, input.to);
				for (const event of events) {
					const { host, name, tld, ttl } = event.args;
					const _host = ethers.utils.toUtf8String(host);
					const _name = ethers.utils.toUtf8String(name);
					const _tld = ethers.utils.toUtf8String(tld);
					const fqdn = `${_host}.${_name}.${_tld}`;
					await putEvent(input.chainId, DomainProvider.EDNS, fqdn, eventType, {
						host: _host,
						name: _name,
						tld: _tld,
						ttl,
					});
				}
				break;
			}
			case EdnsEventType.REMOVE_HOST: {
				const filter = contracts.registry.filters["RemoveHost"]();
				const events = await contracts.registry.queryFilter(filter, input.from, input.to);
				for (const event of events) {
					const { host, name, tld } = event.args;
					const _host = ethers.utils.toUtf8String(host);
					const _name = ethers.utils.toUtf8String(name);
					const _tld = ethers.utils.toUtf8String(tld);
					const fqdn = `${_host}.${_name}.${_tld}`;
					await putEvent(input.chainId, DomainProvider.EDNS, fqdn, eventType, {
						host: _host,
						name: _name,
						tld: _tld,
					});
				}
				break;
			}
			case EdnsEventType.SET_HOST_OPERATOR: {
				const filter = contracts.registry.filters["SetHostOperator"]();
				const events = await contracts.registry.queryFilter(filter, input.from, input.to);
				for (const event of events) {
					const { host, name, tld, operator, approved } = event.args;
					const [_host, _name, _tld] = await Promise.all([
						contracts.registry["getName(bytes32,bytes32,bytes32)"](host, name, tld),
						contracts.registry["getName(bytes32,bytes32)"](name, tld),
						contracts.registry["getName(bytes32)"](tld),
					]);
					const __host = ethers.utils.toUtf8String(host);
					const __name = ethers.utils.toUtf8String(name);
					const __tld = ethers.utils.toUtf8String(tld);
					const fqdn = `${__host}.${__name}.${__tld}`;
					await putEvent(input.chainId, DomainProvider.EDNS, fqdn, eventType, {
						host: __host,
						name: __name,
						tld: __tld,
						operator,
						approved,
					});
				}
				break;
			}
			case EdnsEventType.BRIDGE_ACCEPTED: {
				break;
			}
			case EdnsEventType.BRIDGE_REQUESTED: {
				break;
			}
			case EdnsEventType.SET_ADDRESS_RECORD: {
				break;
			}
			case EdnsEventType.UNSET_ADDRESS_RECORD: {
				break;
			}
			case EdnsEventType.SET_MULTI_COIN_ADDRESS_RECORD: {
				break;
			}
			case EdnsEventType.UNSET_MULTI_COIN_ADDRESS_RECORD: {
				break;
			}
			case EdnsEventType.SET_TEXT_RECORD: {
				break;
			}
			case EdnsEventType.UNSET_TEXT_RECORD: {
				break;
			}
			case EdnsEventType.SET_TYPED_TEXT_RECORD: {
				break;
			}
			case EdnsEventType.UNSET_TYPED_TEXT_RECORD: {
				break;
			}
			case EdnsEventType.SET_NFT_RECORD: {
				break;
			}
			case EdnsEventType.UNSET_NFT_RECORD: {
				break;
			}
			case EdnsEventType.SET_REVERSE_ADDRESS_RECORD: {
				break;
			}
			case EdnsEventType.UNSET_REVERSE_ADDRESS_RECORD: {
				break;
			}
		}
	}
};
