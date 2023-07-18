import { putEvent } from "../utils/put-event";
import { EventType } from "../constants/event-type.constant";
import { DomainProvider } from "../constants/domain-provider.constant";
import { PublicResolver, Registrar, IRegistry, PublicResolver__factory, Registrar__factory, IRegistry__factory } from "../contracts/ethereum/edns-v2";
import { JsonRpcProvider, WebSocketProvider } from "@ethersproject/providers";

export interface IEthereumListenerConstructorProps {
	id: number;
	name: string;
	rpc: string;
	contracts: {
		resolver: string;
		registrar: string;
		registry: string;
	};
}

export default class EdnsEthereumListener {
	private readonly id: number;
	private readonly name: string;
	private readonly rpc: string;
	public readonly provider: JsonRpcProvider | WebSocketProvider;
	public readonly mainnet: boolean;
	public readonly contracts: {
		resolver: PublicResolver;
		registrar: Registrar;
		registry: IRegistry;
	};

	constructor(props: IEthereumListenerConstructorProps) {
		this.id = props.id;
		this.name = props.name;
		this.rpc = props.rpc;
		this.mainnet = process.env.MAINNET == "1";
		if (this.rpc.startsWith("http")) {
			this.provider = new JsonRpcProvider(this.rpc, { name: this.name, chainId: this.id });
		} else if (this.rpc.startsWith("ws")) {
			this.provider = new WebSocketProvider(this.rpc, { name: this.name, chainId: this.id });
		}
		this.provider.pollingInterval = 10000;
		this.contracts = {
			resolver: PublicResolver__factory.connect(props.contracts.resolver, this.provider),
			registrar: Registrar__factory.connect(props.contracts.registrar, this.provider),
			registry: IRegistry__factory.connect(props.contracts.registry, this.provider),
		};
	}

	private _listen_Registrar_DomainRegistered() {
		const filter = this.contracts.registrar.filters["DomainRegistered"]();
		this.contracts.registrar.on(filter, async (name, tld, owner, expiry, event) => {
			const fqdn = `${name}.${tld}`;
			await putEvent(this.mainnet, DomainProvider.EDNS, fqdn, EventType.DOMAIN_REGISTERED, {
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
			const fqdn = `${name}.${tld}`;
			await putEvent(this.mainnet, DomainProvider.EDNS, fqdn, EventType.DOMAIN_RENEWED, {
				name,
				tld,
				expiry: expiry.toString(),
			});
		});
	}

	private _listen_Registry_DomainBridged() {
		const filter = this.contracts.registry.filters["DomainBridged"]();
		this.contracts.resolver.on(filter, async (name, tld, dstChain, event) => {
			const fqdn = `${name}.${tld}`;
			await putEvent(this.mainnet, DomainProvider.EDNS, fqdn, EventType.DOMAIN_BRIDGED, {
				name,
				tld,
				dstChain,
			});
		});
	}

	private _listen_Registry_SetDomainResolver() {
		const filter = this.contracts.registry.filters["SetDomainResolver"]();
		this.contracts.resolver.on(filter, async (name, tld, newResolver, event) => {
			const fqdn = `$${name}.${tld}`;
			await putEvent(this.mainnet, DomainProvider.EDNS, fqdn, EventType.DOMAIN_RENEWED, {
				name,
				tld,
				newResolver,
			});
		});
	}

	private _listen_Registry_SetDomainOperator() {
		const filter = this.contracts.registry.filters["SetDomainOperator"]();
		this.contracts.resolver.on(filter, async (name, tld, operator, approved, event) => {
			const fqdn = `${name}.${tld}`;
			await putEvent(this.mainnet, DomainProvider.EDNS, fqdn, EventType.SET_DOMAIN_OPERATOR, {
				name,
				tld,
				operator,
				approved,
			});
		});
	}

	private _listen_Registry_SetDomainUser() {
		const filter = this.contracts.registry.filters["SetDomainUser"]();
		this.contracts.resolver.on(filter, async (name, tld, newUser, expiry, event) => {
			const fqdn = `${name}.${tld}`;
			await putEvent(this.mainnet, DomainProvider.EDNS, fqdn, EventType.SET_DOMAIN_USER, {
				name,
				tld,
				newUser,
				expiry: expiry.toString(),
			});
		});
	}

	private _listen_Registry_NewHost() {
		const filter = this.contracts.registry.filters["NewHost"]();
		this.contracts.resolver.on(filter, async (host, name, tld, ttl, event) => {
			const fqdn = `${host}.${name}.${tld}`;
			await putEvent(this.mainnet, DomainProvider.EDNS, fqdn, EventType.NEW_HOST, {
				host,
				name,
				tld,
				ttl,
			});
		});
	}

	private _listen_Registry_RemoveHost() {
		const filter = this.contracts.registry.filters["RemoveHost"]();
		this.contracts.resolver.on(filter, async (host, name, tld, event) => {
			const fqdn = `${host}.${name}.${tld}`;
			await putEvent(this.mainnet, DomainProvider.EDNS, fqdn, EventType.REMOVE_HOST, {
				host,
				name,
				tld,
			});
		});
	}

	private _listen_Registry_SetHostOperator() {
		const filter = this.contracts.registry.filters["SetHostOperator"]();
		this.contracts.resolver.on(filter, async (host, name, tld, operator, approved, event) => {
			const fqdn = `${host}.${name}.${tld}`;
			await putEvent(this.mainnet, DomainProvider.EDNS, fqdn, EventType.SET_HOST_OPERATOR, {
				host,
				name,
				tld,
				operator,
				approved,
			});
		});
	}

	private _listen_Registry_SetHostUser() {
		const filter = this.contracts.registry.filters["SetHostUser"]();
		this.contracts.resolver.on(filter, async (host, name, tld, newUser, expiry, event) => {
			const fqdn = `${host}.${name}.${tld}`;
			await putEvent(this.mainnet, DomainProvider.EDNS, fqdn, EventType.SET_HOST_USER, {
				host,
				name,
				tld,
				newUser,
				expiry: expiry.toString(),
			});
		});
	}

	private _listen_Resolver_SetAddressRecord() {
		const filter = this.contracts.resolver.filters["SetAddress"]();
		this.contracts.resolver.on(filter, async (host, name, tld, address, event) => {
			const fqdn = `${host}.${name}.${tld}`;
			await putEvent(this.mainnet, DomainProvider.EDNS, fqdn, EventType.SET_ADDRESS_RECORD, {
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
			const fqdn = `${host}.${name}.${tld}`;
			await putEvent(this.mainnet, DomainProvider.EDNS, fqdn, EventType.UNSET_ADDRESS_RECORD, {
				host,
				name,
				tld,
			});
		});
	}

	private _listen_Resolver_SetMultiCoinAddressRecord() {
		const filter = this.contracts.resolver.filters["SetMultiCoinAddress"]();
		this.contracts.resolver.on(filter, async (host, name, tld, coin, address, event) => {
			const fqdn = `${host}.${name}.${tld}`;
			await putEvent(this.mainnet, DomainProvider.EDNS, fqdn, EventType.SET_MULTI_COIN_ADDRESS_RECORD, {
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
			const fqdn = `${host}.${name}.${tld}`;
			await putEvent(this.mainnet, DomainProvider.EDNS, fqdn, EventType.UNSET_MULTI_COIN_ADDRESS_RECORD, {
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
			const fqdn = `${host}.${name}.${tld}`;
			await putEvent(this.mainnet, DomainProvider.EDNS, fqdn, EventType.SET_TEXT_RECORD, {
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
			const fqdn = `${host}.${name}.${tld}`;
			await putEvent(this.mainnet, DomainProvider.EDNS, fqdn, EventType.UNSET_TEXT_RECORD, {
				host,
				name,
				tld,
			});
		});
	}

	private _listen_Resolver_SetTypedTextRecord() {
		const filter = this.contracts.resolver.filters["SetTypedText"]();
		this.contracts.resolver.on(filter, async (host, name, tld, type, text, event) => {
			const fqdn = `${host}.${name}.${tld}`;
			await putEvent(this.mainnet, DomainProvider.EDNS, fqdn, EventType.SET_TYPED_TEXT_RECORD, {
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
			const fqdn = `${host}.${name}.${tld}`;
			await putEvent(this.mainnet, DomainProvider.EDNS, fqdn, EventType.UNSET_TYPED_TEXT_RECORD, {
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
			const fqdn = `${host}.${name}.${tld}`;
			await putEvent(this.mainnet, DomainProvider.EDNS, fqdn, EventType.SET_NFT_RECORD, {
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
			const fqdn = `${host}.${name}.${tld}`;
			await putEvent(this.mainnet, DomainProvider.EDNS, fqdn, EventType.SET_NFT_RECORD, {
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
		this._listen_Registry_DomainBridged();
		this._listen_Registry_SetDomainResolver();
		this._listen_Registry_SetDomainOperator();
		this._listen_Registry_SetDomainUser();
		this._listen_Registry_NewHost();
		this._listen_Registry_RemoveHost();
		this._listen_Registry_SetHostOperator();
		this._listen_Registry_SetHostUser();

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
	}
}
