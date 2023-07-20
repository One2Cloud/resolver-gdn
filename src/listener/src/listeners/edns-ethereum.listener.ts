import { putEvent } from "../utils/put-event";
import { EventType } from "../constants/event-type.constant";
import { DomainProvider } from "../constants/domain-provider.constant";
import { PublicResolver, Registrar, IRegistry, PublicResolver__factory, Registrar__factory, IRegistry__factory, Bridge, Bridge__factory } from "../contracts/ethereum/edns-v2";
import { JsonRpcProvider, WebSocketProvider } from "@ethersproject/providers";
import { ethers } from "ethers";

export interface IEthereumListenerConstructorProps {
	id: number;
	name: string;
	rpc: string;
	contracts: {
		resolver: string;
		registrar: string;
		registry: string;
		bridge?: string;
	};
}

export default class EdnsEthereumListener {
	private readonly id: number;
	private readonly name: string;
	private readonly rpc: string;
	public readonly provider: JsonRpcProvider | WebSocketProvider;
	public readonly contracts: {
		resolver: PublicResolver;
		registrar: Registrar;
		registry: IRegistry;
		bridge?: Bridge;
	};

	constructor(props: IEthereumListenerConstructorProps) {
		this.id = props.id;
		this.name = props.name;
		this.rpc = props.rpc;
		if (this.rpc.startsWith("http")) {
			this.provider = new JsonRpcProvider(this.rpc, { name: this.name, chainId: this.id });
			// this.provider.pollingInterval = 10000;
		} else if (this.rpc.startsWith("ws")) {
			this.provider = new WebSocketProvider(this.rpc, { name: this.name, chainId: this.id });
			// (this.provider as WebSocketProvider).websocket.onerror!((err: any) => console.error(`Error occurred on [${this.id}]: ${err}`));
		}
		this.contracts = {
			resolver: PublicResolver__factory.connect(props.contracts.resolver, this.provider),
			registrar: Registrar__factory.connect(props.contracts.registrar, this.provider),
			registry: IRegistry__factory.connect(props.contracts.registry, this.provider),
		};
		if (props.contracts.bridge) {
			this.contracts.bridge = Bridge__factory.connect(props.contracts.bridge, this.provider);
		}
	}

	private _listen_Bridge_Bridged() {
		if (this.contracts.bridge) {
			const filter = this.contracts.bridge.filters["Bridged"]();
			this.contracts.bridge.on(filter, async (nonce, sender, ref, event) => {
				const data = await this.contracts.bridge!.getBridgedRequest(ref);
				if (data) {
					const fqdn = `${data.name}.${data.tld}`;
					await putEvent(this.id, DomainProvider.EDNS, fqdn, EventType.BRIDGE_REQUESTED, {
						chainId: this.id,
						ref,
					});
				}
			});
		}
	}

	private _listen_Bridge_Accepted() {
		if (this.contracts.bridge) {
			const filter = this.contracts.bridge.filters["Accepted"]();
			this.contracts.bridge.on(filter, async (nonce, sender, ref, event) => {
				const data = await this.contracts.bridge!.getAcceptedRequest(ref);
				if (data) {
					const fqdn = `${data.name}.${data.tld}`;
					await putEvent(this.id, DomainProvider.EDNS, fqdn, EventType.BRIDGE_ACCEPTED, {
						chainId: this.id,
						ref,
					});
				}
			});
		}
	}

	private _listen_Registrar_DomainRegistered() {
		const filter = this.contracts.registrar.filters["DomainRegistered"]();
		this.contracts.registrar.on(filter, async (name, tld, owner, expiry, event) => {
			const _name = ethers.utils.toUtf8String(name);
			const _tld = ethers.utils.toUtf8String(tld);
			const fqdn = `${_name}.${_tld}`;
			await putEvent(this.id, DomainProvider.EDNS, fqdn, EventType.DOMAIN_REGISTERED, {
				name,
				tld,
				owner,
				expiry: expiry.toString(),
				chain: this.id,
			});
		});
	}

	private _listen_Registrar_DomainRenewed() {
		const filter = this.contracts.registrar.filters["DomainRenewed"]();
		this.contracts.registrar.on(filter, async (name, tld, expiry, event) => {
			const _name = ethers.utils.toUtf8String(name);
			const _tld = ethers.utils.toUtf8String(tld);
			const fqdn = `${_name}.${_tld}`;
			await putEvent(this.id, DomainProvider.EDNS, fqdn, EventType.DOMAIN_RENEWED, {
				name: _name,
				tld: _tld,
				expiry: expiry.toString(),
			});
		});
	}

	// private _listen_Registry_DomainBridged() {
	// 	const filter = this.contracts.registry.filters["DomainBridged"]();
	// 	this.contracts.registry.on(filter, async (name, tld, dstChain, event) => {
	// 		const fqdn = `${name}.${tld}`;
	// 		await putEvent(this.id, DomainProvider.EDNS, fqdn, EventType.DOMAIN_BRIDGED, {
	// 			name,
	// 			tld,
	// 			dstChain,
	// 		});
	// 	});
	// }

	private _listen_Registry_SetDomainOwner() {
		const filter = this.contracts.registry.filters["SetDomainOwner"]();
		this.contracts.registry.on(filter, async (name, tld, newOwner, event) => {
			const [_name, _tld] = await Promise.all([this.contracts.registry["getName(bytes32,bytes32)"](name, tld), this.contracts.registry["getName(bytes32)"](tld)]);
			const __name = ethers.utils.toUtf8String(name);
			const __tld = ethers.utils.toUtf8String(tld);
			const fqdn = `$${__name}.${__tld}`;
			await putEvent(this.id, DomainProvider.EDNS, fqdn, EventType.SET_DOMAIN_OWNER, {
				name: __name,
				tld: __tld,
				newOwner,
			});
		});
	}

	private _listen_Registry_SetDomainResolver() {
		const filter = this.contracts.registry.filters["SetDomainResolver"]();
		this.contracts.registry.on(filter, async (name, tld, newResolver, event) => {
			const [_name, _tld] = await Promise.all([this.contracts.registry["getName(bytes32,bytes32)"](name, tld), this.contracts.registry["getName(bytes32)"](tld)]);
			const __name = ethers.utils.toUtf8String(name);
			const __tld = ethers.utils.toUtf8String(tld);
			const fqdn = `$${__name}.${__tld}`;
			await putEvent(this.id, DomainProvider.EDNS, fqdn, EventType.DOMAIN_RENEWED, {
				name: __name,
				tld: __tld,
				newResolver,
			});
		});
	}

	private _listen_Registry_SetDomainOperator() {
		const filter = this.contracts.registry.filters["SetDomainOperator"]();
		this.contracts.registry.on(filter, async (name, tld, operator, approved, event) => {
			const [_name, _tld] = await Promise.all([this.contracts.registry["getName(bytes32,bytes32)"](name, tld), this.contracts.registry["getName(bytes32)"](tld)]);
			const __name = ethers.utils.toUtf8String(name);
			const __tld = ethers.utils.toUtf8String(tld);
			const fqdn = `$${__name}.${__tld}`;
			await putEvent(this.id, DomainProvider.EDNS, fqdn, EventType.SET_DOMAIN_OPERATOR, {
				name: __name,
				tld: __tld,
				operator,
				approved,
			});
		});
	}

	private _listen_Registry_SetDomainUser() {
		const filter = this.contracts.registry.filters["SetDomainUser"]();
		this.contracts.registry.on(filter, async (name, tld, newUser, expiry, event) => {
			const [_name, _tld] = await Promise.all([this.contracts.registry["getName(bytes32,bytes32)"](name, tld), this.contracts.registry["getName(bytes32)"](tld)]);
			const __name = ethers.utils.toUtf8String(name);
			const __tld = ethers.utils.toUtf8String(tld);
			const fqdn = `$${__name}.${__tld}`;
			await putEvent(this.id, DomainProvider.EDNS, fqdn, EventType.SET_DOMAIN_USER, {
				name: __name,
				tld: __tld,
				newUser,
				expiry: expiry.toString(),
			});
		});
	}

	private _listen_Registry_NewHost() {
		const filter = this.contracts.registry.filters["NewHost"]();
		this.contracts.registry.on(filter, async (host, name, tld, ttl, event) => {
			const _host = ethers.utils.toUtf8String(host);
			const _name = ethers.utils.toUtf8String(name);
			const _tld = ethers.utils.toUtf8String(tld);
			const fqdn = `${_host}.${_name}.${_tld}`;
			await putEvent(this.id, DomainProvider.EDNS, fqdn, EventType.NEW_HOST, {
				host: _host,
				name: _name,
				tld: _tld,
				ttl,
			});
		});
	}

	private _listen_Registry_RemoveHost() {
		const filter = this.contracts.registry.filters["RemoveHost"]();
		this.contracts.registry.on(filter, async (host, name, tld, event) => {
			const [_host, _name, _tld] = await Promise.all([
				this.contracts.registry["getName(bytes32,bytes32,bytes32)"](host, name, tld),
				this.contracts.registry["getName(bytes32,bytes32)"](name, tld),
				this.contracts.registry["getName(bytes32)"](tld),
			]);
			const __host = ethers.utils.toUtf8String(host);
			const __name = ethers.utils.toUtf8String(name);
			const __tld = ethers.utils.toUtf8String(tld);
			const fqdn = `${__host}.${__name}.${__tld}`;
			await putEvent(this.id, DomainProvider.EDNS, fqdn, EventType.REMOVE_HOST, {
				host: __host,
				name: __name,
				tld: __tld,
			});
		});
	}

	private _listen_Registry_SetHostOperator() {
		const filter = this.contracts.registry.filters["SetHostOperator"]();
		this.contracts.registry.on(filter, async (host, name, tld, operator, approved, event) => {
			const [_host, _name, _tld] = await Promise.all([
				this.contracts.registry["getName(bytes32,bytes32,bytes32)"](host, name, tld),
				this.contracts.registry["getName(bytes32,bytes32)"](name, tld),
				this.contracts.registry["getName(bytes32)"](tld),
			]);
			const __host = ethers.utils.toUtf8String(host);
			const __name = ethers.utils.toUtf8String(name);
			const __tld = ethers.utils.toUtf8String(tld);
			const fqdn = `${__host}.${__name}.${__tld}`;
			await putEvent(this.id, DomainProvider.EDNS, fqdn, EventType.SET_HOST_OPERATOR, {
				host: __host,
				name: __name,
				tld: __tld,
				operator,
				approved,
			});
		});
	}

	private _listen_Registry_SetHostUser() {
		const filter = this.contracts.registry.filters["SetHostUser"]();
		this.contracts.registry.on(filter, async (host, name, tld, newUser, expiry, event) => {
			const [_host, _name, _tld] = await Promise.all([
				this.contracts.registry["getName(bytes32,bytes32,bytes32)"](host, name, tld),
				this.contracts.registry["getName(bytes32,bytes32)"](name, tld),
				this.contracts.registry["getName(bytes32)"](tld),
			]);
			const __host = ethers.utils.toUtf8String(host);
			const __name = ethers.utils.toUtf8String(name);
			const __tld = ethers.utils.toUtf8String(tld);
			const fqdn = `${__host}.${__name}.${__tld}`;
			await putEvent(this.id, DomainProvider.EDNS, fqdn, EventType.SET_HOST_USER, {
				host: __host,
				name: __name,
				tld: __tld,
				newUser,
				expiry: expiry.toString(),
			});
		});
	}

	private _listen_Resolver_SetReverseAddressRecord() {
		const filter = this.contracts.resolver.filters["SetReverseAddress"]();
		this.contracts.resolver.on(filter, async (host, name, tld, address, event) => {
			const _host = ethers.utils.toUtf8String(host);
			const _name = ethers.utils.toUtf8String(name);
			const _tld = ethers.utils.toUtf8String(tld);
			const fqdn = `${_host}.${_name}.${_tld}`;
			await putEvent(this.id, DomainProvider.EDNS, fqdn, EventType.SET_REVERSE_ADDRESS_RECORD, {
				host,
				name,
				tld,
				address,
			});
		});
	}

	private _listen_Resolver_UnsetReverseAddressRecord() {
		const filter = this.contracts.resolver.filters["SetReverseAddress"]();
		this.contracts.resolver.on(filter, async (host, name, tld, address, event) => {
			const _host = ethers.utils.toUtf8String(host);
			const _name = ethers.utils.toUtf8String(name);
			const _tld = ethers.utils.toUtf8String(tld);
			const fqdn = `${_host}.${_name}.${_tld}`;
			await putEvent(this.id, DomainProvider.EDNS, fqdn, EventType.UNSET_REVERSE_ADDRESS_RECORD, {
				host,
				name,
				tld,
				address,
			});
		});
	}

	private _listen_Resolver_SetAddressRecord() {
		const filter = this.contracts.resolver.filters["SetAddress"]();
		this.contracts.resolver.on(filter, async (host, name, tld, address, event) => {
			const _host = ethers.utils.toUtf8String(host);
			const _name = ethers.utils.toUtf8String(name);
			const _tld = ethers.utils.toUtf8String(tld);
			const fqdn = `${_host}.${_name}.${_tld}`;
			await putEvent(this.id, DomainProvider.EDNS, fqdn, EventType.SET_ADDRESS_RECORD, {
				host,
				name,
				tld,
				address,
			});
		});
	}

	private _listen_Resolver_UnsetAddressRecord() {
		const filter = this.contracts.resolver.filters["UnsetAddress"]();
		this.contracts.resolver.on(filter, async (host, name, tld, event) => {
			const _host = ethers.utils.toUtf8String(host);
			const _name = ethers.utils.toUtf8String(name);
			const _tld = ethers.utils.toUtf8String(tld);
			const fqdn = `${_host}.${_name}.${_tld}`;
			await putEvent(this.id, DomainProvider.EDNS, fqdn, EventType.UNSET_ADDRESS_RECORD, {
				host,
				name,
				tld,
			});
		});
	}

	private _listen_Resolver_SetMultiCoinAddressRecord() {
		const filter = this.contracts.resolver.filters["SetMultiCoinAddress"]();
		this.contracts.resolver.on(filter, async (host, name, tld, coin, address, event) => {
			const _host = ethers.utils.toUtf8String(host);
			const _name = ethers.utils.toUtf8String(name);
			const _tld = ethers.utils.toUtf8String(tld);
			const fqdn = `${_host}.${_name}.${_tld}`;
			await putEvent(this.id, DomainProvider.EDNS, fqdn, EventType.SET_MULTI_COIN_ADDRESS_RECORD, {
				host,
				name,
				tld,
				coin,
				address,
			});
		});
	}

	private _listen_Resolver_UnsetMultiCoinAddressRecord() {
		const filter = this.contracts.resolver.filters["UnsetMultiCoinAddress"]();
		this.contracts.resolver.on(filter, async (host, name, tld, coin, event) => {
			const _host = ethers.utils.toUtf8String(host);
			const _name = ethers.utils.toUtf8String(name);
			const _tld = ethers.utils.toUtf8String(tld);
			const fqdn = `${_host}.${_name}.${_tld}`;
			await putEvent(this.id, DomainProvider.EDNS, fqdn, EventType.UNSET_MULTI_COIN_ADDRESS_RECORD, {
				host,
				name,
				tld,
				coin,
			});
		});
	}

	private _listen_Resolver_SetTextRecord() {
		const filter = this.contracts.resolver.filters["SetText"]();
		this.contracts.resolver.on(filter, async (host, name, tld, text, event) => {
			const _host = ethers.utils.toUtf8String(host);
			const _name = ethers.utils.toUtf8String(name);
			const _tld = ethers.utils.toUtf8String(tld);
			const fqdn = `${_host}.${_name}.${_tld}`;
			await putEvent(this.id, DomainProvider.EDNS, fqdn, EventType.SET_TEXT_RECORD, {
				host,
				name,
				tld,
				text,
			});
		});
	}

	private _listen_Resolver_UnsetTextRecord() {
		const filter = this.contracts.resolver.filters["UnsetText"]();
		this.contracts.resolver.on(filter, async (host, name, tld, event) => {
			const _host = ethers.utils.toUtf8String(host);
			const _name = ethers.utils.toUtf8String(name);
			const _tld = ethers.utils.toUtf8String(tld);
			const fqdn = `${_host}.${_name}.${_tld}`;
			await putEvent(this.id, DomainProvider.EDNS, fqdn, EventType.UNSET_TEXT_RECORD, {
				host,
				name,
				tld,
			});
		});
	}

	private _listen_Resolver_SetTypedTextRecord() {
		const filter = this.contracts.resolver.filters["SetTypedText"]();
		this.contracts.resolver.on(filter, async (host, name, tld, type, text, event) => {
			const _host = ethers.utils.toUtf8String(host);
			const _name = ethers.utils.toUtf8String(name);
			const _tld = ethers.utils.toUtf8String(tld);
			const fqdn = `${_host}.${_name}.${_tld}`;
			await putEvent(this.id, DomainProvider.EDNS, fqdn, EventType.SET_TYPED_TEXT_RECORD, {
				host,
				name,
				tld,
				type,
				text,
			});
		});
	}

	private _listen_Resolver_UnsetTypedTextRecord() {
		const filter = this.contracts.resolver.filters["UnsetTypedText"]();
		this.contracts.resolver.on(filter, async (host, name, tld, type, event) => {
			const _host = ethers.utils.toUtf8String(host);
			const _name = ethers.utils.toUtf8String(name);
			const _tld = ethers.utils.toUtf8String(tld);
			const fqdn = `${_host}.${_name}.${_tld}`;
			await putEvent(this.id, DomainProvider.EDNS, fqdn, EventType.UNSET_TYPED_TEXT_RECORD, {
				host,
				name,
				tld,
				type,
			});
		});
	}

	private _listen_Resolver_SetNFTRecord() {
		const filter = this.contracts.resolver.filters["SetNFT"]();
		this.contracts.resolver.on(filter, async (host, name, tld, chainId, contractAddress, tokenId, event) => {
			const _host = ethers.utils.toUtf8String(host);
			const _name = ethers.utils.toUtf8String(name);
			const _tld = ethers.utils.toUtf8String(tld);
			const fqdn = `${_host}.${_name}.${_tld}`;
			await putEvent(this.id, DomainProvider.EDNS, fqdn, EventType.SET_NFT_RECORD, {
				host,
				name,
				tld,
				chainId,
				contractAddress,
				tokenId,
			});
		});
	}

	private _listen_Resolver_UnsetNFTRecord() {
		const filter = this.contracts.resolver.filters["UnsetNFT"]();
		this.contracts.resolver.on(filter, async (host, name, tld, chainId, event) => {
			const _host = ethers.utils.toUtf8String(host);
			const _name = ethers.utils.toUtf8String(name);
			const _tld = ethers.utils.toUtf8String(tld);
			const fqdn = `${_host}.${_name}.${_tld}`;
			await putEvent(this.id, DomainProvider.EDNS, fqdn, EventType.SET_NFT_RECORD, {
				host,
				name,
				tld,
				chainId,
			});
		});
	}

	public start(): void {
		console.log(`EDNS: Start listening on - ${this.id} - ${this.name}`);

		this._listen_Registrar_DomainRegistered();
		this._listen_Registrar_DomainRenewed();
		// this._listen_Registry_DomainBridged();
		this._listen_Registry_SetDomainResolver();
		this._listen_Registry_SetDomainOperator();
		this._listen_Registry_SetDomainUser();
		this._listen_Registry_NewHost();
		this._listen_Registry_RemoveHost();
		this._listen_Registry_SetDomainOwner();
		this._listen_Registry_SetHostOperator();
		this._listen_Registry_SetHostUser();

		this._listen_Resolver_SetReverseAddressRecord();
		this._listen_Resolver_UnsetReverseAddressRecord();
		this._listen_Resolver_SetAddressRecord();
		this._listen_Resolver_UnsetAddressRecord();
		this._listen_Resolver_SetMultiCoinAddressRecord();
		this._listen_Resolver_UnsetMultiCoinAddressRecord();
		this._listen_Resolver_SetTextRecord();
		this._listen_Resolver_UnsetTextRecord();
		this._listen_Resolver_SetTypedTextRecord();
		this._listen_Resolver_UnsetTypedTextRecord();
		this._listen_Resolver_SetNFTRecord();
		this._listen_Resolver_UnsetNFTRecord();

		if (this.contracts.bridge) {
			this._listen_Bridge_Bridged();
			this._listen_Bridge_Accepted();
		}
	}

	public stop(): void {
		this.provider.removeAllListeners();
	}
}
