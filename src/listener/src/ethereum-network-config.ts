export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export enum Network {
	ETHEREUM = 1,
	GOERLI = 5,
	BNB_CHAIN = 56,
	BNB_CHAIN_TESTNET = 97,
	POLYGON = 137,
	POLYGON_MUMBAI = 80001,
	POLYGON_ZKEVM = 1101,
	POLYGON_ZKEVM_TESTNET = 1442,
	AVALANCHE = 43114,
	AVALANCHE_FUJI = 43113,
	FANTOM = 250,
	FANTOM_TESTNET = 4002,
	OPTIMISM = 10,
	OPTIMISM_GOERLI = 420,
	ARBITRUM = 42161,
	ARBITRUM_GOERLI = 421613,
	IOTEX = 4689,
	IOTEX_TESTNET = 4690,
	OKC = 66,
	OKC_TESTNET = 65,
	// HECO = 128,
	// HECO_TESTNET = 256,
	KCC = 321,
	KCC_TESTNET = 322,
	VELAS_EVM = 106,
	VELAS_EVM_TESTNET = 111,
	GNOSIS = 100,
	GNOSIS_CHIADO = 10200,
	MOONBEAM = 1284,
	MOONBASE_ALPHA = 1287,
	MOONRIVER = 1285,
	HARMONY = 1666600000,
	HARMONEY_TESTNET = 1666700000,
	// ASTR = 492,
	// METIS = 1088,
	// CRONOS = 25,
	// CRONOS_TESTNET = 338,
	// EVMOS = 9001,
	// EVMOS_TESTNET = 9000,
	// KLAYTN = 8217,
	// KLAYTN_TESTNET = 1001,
	// AURORA = 1313161554,
	// AURORA_TESTNET = 1313161555,
	// FUSE = 122,
	// FUSE_TESTNET = 123,
	CELO = 42220,
	CELO_ALFAJORES = 44787,
	// TELOS_EVM = 40,
	// TELOS_EVM_TESTNET = 41
	ZKSYNC_ERA_TESTNET = 280,
	ZKSYNC_ERA = 324,
}

export const Mainnets = [
	Network.ETHEREUM,
	Network.BNB_CHAIN,
	Network.POLYGON,
	Network.AVALANCHE,
	Network.FANTOM,
	Network.OPTIMISM,
	Network.ARBITRUM,
	Network.GNOSIS,
	Network.CELO,
	Network.OKC,
	Network.ZKSYNC_ERA,
	Network.POLYGON_ZKEVM,
	Network.MOONBEAM,
	Network.MOONRIVER,
	Network.HARMONY,
];

export const Testnets = [
	Network.GOERLI,
	Network.BNB_CHAIN_TESTNET,
	Network.POLYGON_MUMBAI,
	Network.AVALANCHE_FUJI,
	Network.FANTOM_TESTNET,
	Network.OPTIMISM_GOERLI,
	Network.ARBITRUM_GOERLI,
	Network.GNOSIS_CHIADO,
	Network.CELO_ALFAJORES,
	Network.OKC_TESTNET,
	Network.ZKSYNC_ERA_TESTNET,
	Network.POLYGON_ZKEVM_TESTNET,
	Network.MOONBASE_ALPHA,
	Network.HARMONEY_TESTNET,
];

export interface INetworkConfig {
	[chainId: number]: {
		chainId: number;
		name: string;
		symbol: string;
		url: string;
		routerProtocol?: {
			v1: {
				chainId: number;
				handler: {
					generic: string;
				};
				fee: {
					token: { symbol: string; address: string }[];
				};
			};
		};
		multichain?: {
			v6?: {
				chainId: number;
				endpoint: {
					address: string;
				};
			};
			v7?: {
				chainId: number;
				endpoint: {
					address: string;
				};
			};
		};
		layerzero?: {
			chainId: number;
			endpoint: {
				address: string;
			};
		};
		chainlink?: {
			token: {
				name: string;
				symbol: string;
				decimals: number;
				address: string;
			};
			api?: {
				oracle: {
					address: string;
				};
				jobId: string;
			};
		};
		slip44?: {
			coinId: number;
		};
	};
}

export interface IConfig {
	network: INetworkConfig;
}

const config: INetworkConfig = {
	[Network.ETHEREUM]: {
		chainId: Network.ETHEREUM,
		name: "Ethereum",
		symbol: "ETH",
		url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
		slip44: {
			coinId: 60,
		},
		layerzero: {
			chainId: 1,
			endpoint: {
				address: "0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675",
			},
		},
		routerProtocol: {
			v1: {
				chainId: 7,
				handler: {
					generic: "0x621F0549102262148f6a7D289D8330adf7CbC09F",
				},
				fee: {
					token: [
						{
							symbol: "WETH",
							address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
						},
						{
							symbol: "ROUTE",
							address: "0x16ECCfDbb4eE1A85A33f3A9B21175Cd7Ae753dB4",
						},
					],
				},
			},
		},
		multichain: {
			v6: {
				chainId: Network.ETHEREUM,
				endpoint: {
					address: "0xC10Ef9F491C9B59f936957026020C321651ac078",
				},
			},
		},
		chainlink: {
			token: {
				name: "ChainLink Token",
				symbol: "LINK",
				decimals: 18,
				address: "0x514910771af9ca656af840dff83e8264ecf986ca",
			},
		},
	},
	[Network.GOERLI]: {
		chainId: Network.GOERLI,

		name: "Ethereum Goerli",
		symbol: "gETH",
		url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
		slip44: {
			coinId: 60,
		},
		layerzero: {
			chainId: 10121,
			endpoint: {
				address: "0x79a63d6d8BBD5c6dfc774dA79bCcD948EAcb53FA",
			},
		},
		multichain: {
			v6: {
				chainId: Network.GOERLI,
				endpoint: {
					address: "0x3D4e1981f822e87A1A4C05F2e4b3bcAdE5406AE3",
				},
			},
		},
		chainlink: {
			token: {
				name: "ChainLink Token",
				symbol: "LINK",
				decimals: 18,
				address: "0x01BE23585060835E02B77ef475b0Cc51aA1e0709",
			},
		},
	},
	[Network.BNB_CHAIN]: {
		chainId: Network.BNB_CHAIN,

		name: "BNB Chain",
		symbol: "BNB",
		url: `https://bsc.getblock.io/${process.env.GETBLOCK_API_KEY}/mainnet/`,
		slip44: {
			coinId: 714,
		},
		layerzero: {
			chainId: 2,
			endpoint: {
				address: "0x3c2269811836af69497E5F486A85D7316753cf62",
			},
		},
		multichain: {
			v6: {
				chainId: Network.BNB_CHAIN,
				endpoint: {
					address: "0xC10Ef9F491C9B59f936957026020C321651ac078",
				},
			},
		},
		chainlink: {
			token: {
				name: "ChainLink Token",
				symbol: "LINK",
				decimals: 18,
				address: "0x404460c6a5ede2d891e8297795264fde62adbb75",
			},
		},
	},
	[Network.BNB_CHAIN_TESTNET]: {
		chainId: Network.BNB_CHAIN_TESTNET,

		name: "BNB Chain Testnet",
		symbol: "tBNB",
		url: `https://bsc.getblock.io/${process.env.GETBLOCK_API_KEY}/testnet/`,
		slip44: {
			coinId: 714,
		},
		layerzero: {
			chainId: 10102,
			endpoint: {
				address: "0x6Fcb97553D41516Cb228ac03FdC8B9a0a9df04A1",
			},
		},
		multichain: {
			v6: {
				chainId: Network.BNB_CHAIN_TESTNET,
				endpoint: {
					address: "0xD2b88BA56891d43fB7c108F23FE6f92FEbD32045",
				},
			},
		},
		chainlink: {
			token: {
				name: "ChainLink Token",
				symbol: "LINK",
				decimals: 18,
				address: "0x84b9b910527ad5c03a9ca831909e21e236ea7b06",
			},
		},
	},
	[Network.AVALANCHE]: {
		chainId: Network.AVALANCHE,

		name: "Avalanche C-Chain",
		symbol: "AVAX",
		url: `https://avalanche-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
		slip44: {
			coinId: 9005,
		},
		layerzero: {
			chainId: 6,
			endpoint: {
				address: "0x3c2269811836af69497E5F486A85D7316753cf62",
			},
		},
		multichain: {
			v6: {
				chainId: Network.AVALANCHE,
				endpoint: {
					address: "0xC10Ef9F491C9B59f936957026020C321651ac078",
				},
			},
		},
		chainlink: {
			token: {
				name: "ChainLink Token on Avalanche",
				symbol: "LINK",
				decimals: 18,
				address: "0x5947BB275c521040051D82396192181b413227A3",
			},
		},
	},
	[Network.AVALANCHE_FUJI]: {
		chainId: Network.AVALANCHE_FUJI,

		name: "Avalanche Fuji",
		symbol: "AVAX",
		url: `https://avalanche-fuji.infura.io/v3/${process.env.INFURA_API_KEY}`,
		slip44: {
			coinId: 9005,
		},
		layerzero: {
			chainId: 10106,
			endpoint: {
				address: "0x93f54D755A063cE7bB9e6Ac47Eccc8e33411d706",
			},
		},
		chainlink: {
			token: {
				name: "ChainLink Token on Avalanche",
				symbol: "LINK",
				decimals: 18,
				address: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
			},
		},
	},
	[Network.POLYGON]: {
		chainId: Network.POLYGON,

		name: "Polygon",
		symbol: "MATIC",
		url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
		slip44: {
			coinId: 966,
		},
		layerzero: {
			chainId: 9,
			endpoint: {
				address: "0x3c2269811836af69497E5F486A85D7316753cf62",
			},
		},
		multichain: {
			v6: {
				chainId: Network.POLYGON,
				endpoint: {
					address: "0xC10Ef9F491C9B59f936957026020C321651ac078",
				},
			},
		},
		chainlink: {
			token: {
				name: "ChainLink Token",
				symbol: "LINK",
				decimals: 18,
				address: "0xb0897686c545045afc77cf20ec7a532e3120e0f1",
			},
		},
	},
	[Network.POLYGON_MUMBAI]: {
		chainId: Network.POLYGON_MUMBAI,

		name: "Polygon Mumbai",
		symbol: "MATIC",
		url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_API_KEY}`,
		slip44: {
			coinId: 966,
		},
		layerzero: {
			chainId: 10109,
			endpoint: {
				address: "0xf69186dfBa60DdB133E91E9A4B5673624293d8F8",
			},
		},
		chainlink: {
			token: {
				name: "ChainLink Token",
				symbol: "LINK",
				decimals: 18,
				address: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
			},
		},
	},
	[Network.ARBITRUM]: {
		chainId: Network.ARBITRUM,

		name: "Arbitrum",
		symbol: "ETH",
		url: `https://arbitrum-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
		slip44: {
			coinId: 9001,
		},
		layerzero: {
			chainId: 10,
			endpoint: {
				address: "0x3c2269811836af69497E5F486A85D7316753cf62",
			},
		},
		multichain: {
			v6: {
				chainId: Network.ARBITRUM,
				endpoint: {
					address: "0xC10Ef9F491C9B59f936957026020C321651ac078",
				},
			},
		},
		chainlink: {
			token: {
				name: "ChainLink Token on Arbitrum Mainnet",
				symbol: "LINK",
				decimals: 18,
				address: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
			},
		},
	},
	[Network.ARBITRUM_GOERLI]: {
		chainId: Network.ARBITRUM_GOERLI,

		name: "Arbitrum Goerli",
		symbol: "ETH",
		url: `https://arbitrum-goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
		slip44: {
			coinId: 9001,
		},
		layerzero: {
			chainId: 10143,
			endpoint: {
				address: "0x6aB5Ae6822647046626e83ee6dB8187151E1d5ab",
			},
		},
		chainlink: {
			token: {
				name: "ChainLink Token on Arbitrum Goerli",
				symbol: "LINK",
				decimals: 18,
				address: "0x615fBe6372676474d9e6933d310469c9b68e9726",
			},
		},
	},
	[Network.OPTIMISM]: {
		chainId: Network.OPTIMISM,

		name: "Optimism",
		symbol: "ETH",
		url: `https://optimism-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
		slip44: {
			coinId: 614,
		},
		layerzero: {
			chainId: 11,
			endpoint: {
				address: "0x3c2269811836af69497E5F486A85D7316753cf62",
			},
		},
		multichain: {
			v6: {
				chainId: Network.OPTIMISM,
				endpoint: {
					address: "0xC10Ef9F491C9B59f936957026020C321651ac078",
				},
			},
		},
		chainlink: {
			token: {
				name: "ChainLink Token on Optimism Mainnet",
				symbol: "LINK",
				decimals: 18,
				address: "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6",
			},
		},
	},
	[Network.OPTIMISM_GOERLI]: {
		chainId: Network.OPTIMISM_GOERLI,

		name: "Optimism Goerli",
		symbol: "ETH",
		url: `https://optimism-goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
		slip44: {
			coinId: 614,
		},
		layerzero: {
			chainId: 10132,
			endpoint: {
				address: "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1",
			},
		},
		chainlink: {
			token: {
				name: "ChainLink Token on Optimism Goerli",
				symbol: "LINK",
				decimals: 18,
				address: "0x4911b761993b9c8c0d14Ba2d86902AF6B0074F5B",
			},
		},
	},
	[Network.FANTOM]: {
		chainId: Network.FANTOM,
		name: "Fantom",
		symbol: "FTM",
		url: `https://ftm.getblock.io/${process.env.GETBLOCK_API_KEY}/mainnet/`,
		slip44: {
			coinId: 1007,
		},
		layerzero: {
			chainId: 12,
			endpoint: {
				address: "0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7",
			},
		},
		multichain: {
			v6: {
				chainId: Network.FANTOM,
				endpoint: {
					address: "0xC10Ef9F491C9B59f936957026020C321651ac078",
				},
			},
		},
		chainlink: {
			token: {
				name: "ChainLink Token on Fantom",
				symbol: "LINK",
				decimals: 18,
				address: "0x6F43FF82CCA38001B6699a8AC47A2d0E66939407",
			},
		},
	},
	[Network.FANTOM_TESTNET]: {
		chainId: Network.FANTOM_TESTNET,

		name: "Fantom testnet",
		symbol: "FTM",
		url: `https://rpc.ankr.com/fantom_testnet`,
		slip44: {
			coinId: 1007,
		},
		layerzero: {
			chainId: 10112,
			endpoint: {
				address: "0x7dcAD72640F835B0FA36EFD3D6d3ec902C7E5acf",
			},
		},
		multichain: {
			v6: {
				chainId: 4002,
				endpoint: {
					address: "0xc629d02732EE932db1fa83E1fcF93aE34aBFc96B",
				},
			},
		},
		chainlink: {
			token: {
				name: "ChainLink Token on Fantom",
				symbol: "LINK",
				decimals: 18,
				address: "0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F",
			},
		},
	},
	[Network.IOTEX]: {
		chainId: Network.IOTEX,

		name: "IoTeX Mainnet",
		symbol: "IOTX",
		url: `https://iotex-mainnet.gateway.pokt.network/v1/lb/${process.env.POKT_PORTAL_ID}`,
		slip44: {
			coinId: 304,
		},
		multichain: {
			v6: {
				chainId: Network.IOTEX,
				endpoint: {
					address: "0xC10Ef9F491C9B59f936957026020C321651ac078",
				},
			},
		},
	},
	[Network.IOTEX_TESTNET]: {
		chainId: Network.IOTEX_TESTNET,

		name: "IoTeX Testnet",
		symbol: "IOTX-T",
		url: `https://babel-api.testnet.iotex.io`,
		slip44: {
			coinId: 304,
		},
	},

	[Network.OKC_TESTNET]: {
		chainId: Network.OKC_TESTNET,

		name: "OKC Testnet",
		symbol: "OKT",
		url: `https://exchaintestrpc.okex.org`,
		layerzero: {
			chainId: 10155,
			endpoint: {
				address: "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1",
			},
		},
	},
	[Network.OKC]: {
		chainId: Network.OKC,

		name: "OKC Mainnet",
		symbol: "OKT",
		url: `https://oKc-mainnet.gateway.pokt.network/v1/lb/${process.env.POKT_PORTAL_ID}`,
		layerzero: {
			chainId: 155,
			endpoint: {
				address: "0x9740FF91F1985D8d2B71494aE1A2f723bb3Ed9E4",
			},
		},
	},
	[Network.KCC_TESTNET]: {
		chainId: Network.KCC_TESTNET,
		name: "KCC Testnet",
		symbol: "KCS",
		url: `https://rpc-testnet.kcc.network`,
		slip44: {
			coinId: 641,
		},
	},
	[Network.KCC]: {
		chainId: Network.KCC,
		name: "KCC Mainnet",
		symbol: "KCS",
		url: `https://kcc.getblock.io/${process.env.GETBLOCK_API_KEY}/mainnet/`,
		slip44: {
			coinId: 641,
		},
	},
	[Network.GNOSIS]: {
		chainId: Network.GNOSIS,
		name: "Gnosis Chain",
		symbol: "XDAI",
		url: `https://rpc.gnosis.gateway.fm`,
		slip44: {
			coinId: 700,
		},
		layerzero: {
			chainId: 145,
			endpoint: {
				address: "0x9740FF91F1985D8d2B71494aE1A2f723bb3Ed9E4",
			},
		},
		multichain: {
			v6: {
				chainId: Network.GNOSIS,
				endpoint: {
					address: "0xC10Ef9F491C9B59f936957026020C321651ac078",
				},
			},
		},
	},
	[Network.GNOSIS_CHIADO]: {
		chainId: Network.GNOSIS_CHIADO,
		name: "Gnosis Chiado",
		symbol: "XDAI",
		url: `https://rpc.chiado.gnosis.gateway.fm`,
		slip44: {
			coinId: 700,
		},
		layerzero: {
			chainId: 10145,
			endpoint: {
				address: "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1",
			},
		},
	},
	[Network.MOONBEAM]: {
		chainId: Network.MOONBEAM,
		name: "Moonbeam",
		symbol: "GLMR",
		url: `https://moonbeam.getblock.io/${process.env.GETBLOCK_API_KEY}/mainnet/`,
		slip44: {
			coinId: 1284,
		},
		layerzero: {
			chainId: 126,
			endpoint: {
				address: "0x9740FF91F1985D8d2B71494aE1A2f723bb3Ed9E4",
			},
		},
	},
	[Network.MOONBASE_ALPHA]: {
		chainId: Network.MOONBASE_ALPHA,
		name: "Moonbase Alphanet",
		symbol: "DEV",
		url: `https://moonbase-alpha.public.blastapi.io`,
		layerzero: {
			chainId: 10126,
			endpoint: {
				address: "0xb23b28012ee92E8dE39DEb57Af31722223034747",
			},
		},
	},
	[Network.MOONRIVER]: {
		chainId: Network.MOONRIVER,
		name: "Moonriver",
		symbol: "MOVR",
		url: `https://moonriver.getblock.io/${process.env.GETBLOCK_API_KEY}/mainnet/`,
		slip44: {
			coinId: 1285,
		},
		multichain: {
			v6: {
				chainId: Network.MOONRIVER,
				endpoint: {
					address: "0xC10Ef9F491C9B59f936957026020C321651ac078",
				},
			},
		},
		layerzero: {
			chainId: 167,
			endpoint: {
				address: "0x7004396C99D5690da76A7C59057C5f3A53e01704",
			},
		},
	},
	[Network.CELO]: {
		chainId: Network.CELO,
		name: "Celo Mainnet",
		symbol: "CELO",
		url: `https://celo-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
		layerzero: {
			chainId: 125,
			endpoint: {
				address: "0x3A73033C0b1407574C76BdBAc67f126f6b4a9AA9",
			},
		},
	},
	[Network.CELO_ALFAJORES]: {
		chainId: Network.CELO_ALFAJORES,
		name: "Celo Alfajores Testnet",
		symbol: "CELO",
		url: `https://celo-alfajores.infura.io/v3/${process.env.INFURA_API_KEY}`,
		layerzero: {
			chainId: 10125,
			endpoint: {
				address: "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1",
			},
		},
	},
	[Network.ZKSYNC_ERA]: {
		chainId: Network.ZKSYNC_ERA,
		name: "zkSync Era Mainnet",
		symbol: "ETH",
		url: `https://mainnet.era.zksync.io	`,
		layerzero: {
			chainId: 165,
			endpoint: {
				address: "0x9b896c0e23220469C7AE69cb4BbAE391eAa4C8da",
			},
		},
	},
	[Network.ZKSYNC_ERA_TESTNET]: {
		chainId: Network.ZKSYNC_ERA_TESTNET,
		name: "zkSync Era Testnet",
		symbol: "ETH",
		url: `https://testnet.era.zksync.dev	`,
		layerzero: {
			chainId: 10165,
			endpoint: {
				address: "0x093D2CF57f764f09C3c2Ac58a42A2601B8C79281",
			},
		},
	},
	[Network.POLYGON_ZKEVM]: {
		chainId: Network.POLYGON_ZKEVM,
		name: "Polygon zkEVM",
		symbol: "ETH",
		url: `https://zkevm-rpc.com`,
		layerzero: {
			chainId: 158,
			endpoint: {
				address: "0x9740FF91F1985D8d2B71494aE1A2f723bb3Ed9E4",
			},
		},
	},
	[Network.POLYGON_ZKEVM_TESTNET]: {
		chainId: Network.POLYGON_ZKEVM_TESTNET,
		name: "Polygon zkEVM Testnet",
		symbol: "ETH",
		url: `https://rpc.public.zkevm-test.net	`,
		layerzero: {
			chainId: 10158,
			endpoint: {
				address: "0x6aB5Ae6822647046626e83ee6dB8187151E1d5ab",
			},
		},
	},
	[Network.HARMONY]: {
		chainId: Network.HARMONY,
		name: "Harmony One",
		symbol: "ONE",
		url: `https://one.getblock.io/${process.env.GETBLOCK_API_KEY}/mainnet/`,
		layerzero: {
			chainId: 116,
			endpoint: {
				address: "0x9740FF91F1985D8d2B71494aE1A2f723bb3Ed9E4",
			},
		},
	},
	[Network.HARMONEY_TESTNET]: {
		chainId: Network.HARMONEY_TESTNET,
		name: "Harmony One Testnet",
		symbol: "ONE",
		url: `https://api.s0.b.hmny.io`,
		layerzero: {
			chainId: 10133,
			endpoint: {
				address: "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1",
			},
		},
	},
};

export default config;
