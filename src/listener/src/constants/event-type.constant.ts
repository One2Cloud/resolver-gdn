export enum EventType {
	DOMAIN_REGISTERED = "domain-registered",
	DOMAIN_RENEWED = "domain-renewed",
	DOMAIN_BRIDGED = "domain-bridged",
	SET_DOMAIN_RESOLVER = "set-domain-resolver",
	SET_DOMAIN_OPERATOR = "set-domain-operator",
	SET_DOMAIN_USER = "set-domain-user",
	NEW_HOST = "new-host",
	REMOVE_HOST = "remove-host",
	SET_HOST_OPERATOR = "set-host-operator",
	SET_HOST_USER = "set-host-user",
	// Resolver Record
	SET_ADDRESS_RECORD = "set-address-record",
	UNSET_ADDRESS_RECORD = "unset-address-record",
	SET_MULTI_COIN_ADDRESS_RECORD = "set-multi-coin-address-record",
	UNSET_MULTI_COIN_ADDRESS_RECORD = "unset-multi-coin-address-record",
	SET_TEXT_RECORD = "set-text-record",
	UNSET_TEXT_RECORD = "unset-text-record",
	SET_TYPED_TEXT_RECORD = "set-typed-text-record",
	UNSET_TYPED_TEXT_RECORD = "unset-typed-text-record",
	SET_NFT_RECORD = "set-nft-record",
	UNSET_NFT_RECORD = "unset-nft-record",
	SET_REVERSE_ADDRESS_RECORD = "set-reverse-address-record",
	UNSET_REVERSE_ADDRESS_RECORD = "unset-reverse-address-record",
}
