import { InContractChain } from "../constants/in-contract-chain.constant";
import { Network } from "../network-config";
import { Net } from "../network-config";

export const getChainId = async (net: Net, chain: InContractChain): Promise<Network> => {
  if (net === Net.MAINNET) {
    if (chain === InContractChain.ETHEREUM) return Network.ETHEREUM;
    if (chain === InContractChain.BNB) return Network.BNB_CHAIN;
    if (chain === InContractChain.POLYGON) return Network.POLYGON;
    if (chain === InContractChain.AVALANCHE) return Network.AVALANCHE;
    if (chain === InContractChain.FANTOM) return Network.FANTOM;
    if (chain === InContractChain.OPTIMISM) return Network.OPTIMISM;
    if (chain === InContractChain.ARBITRUM) return Network.ARBITRUM;
    if (chain === InContractChain.IOTEX) return Network.IOTEX;
    if (chain === InContractChain.OKC) return Network.OKC;
    if (chain === InContractChain.GNOSIS) return Network.GNOSIS;
    if (chain === InContractChain.CELO) return Network.CELO;
    if (chain === InContractChain.HARMONY) return Network.HARMONY;
    if (chain === InContractChain.POLYGON_ZKEVM) return Network.POLYGON_ZKEVM;
    if (chain === InContractChain.MOONBEAM) return Network.MOONBEAM;
    if (chain === InContractChain.MOONRIVER) return Network.MOONRIVER;
  } else if (net === Net.TESTNET) {
    if (chain === InContractChain.ETHEREUM) return Network.GOERLI;
    if (chain === InContractChain.BNB) return Network.BNB_CHAIN_TESTNET;
    if (chain === InContractChain.POLYGON) return Network.POLYGON_MUMBAI;
    if (chain === InContractChain.AVALANCHE) return Network.AVALANCHE_FUJI;
    if (chain === InContractChain.FANTOM) return Network.FANTOM_TESTNET;
    if (chain === InContractChain.OPTIMISM) return Network.OPTIMISM_GOERLI;
    if (chain === InContractChain.ARBITRUM) return Network.ARBITRUM_GOERLI;
    if (chain === InContractChain.IOTEX) return Network.IOTEX_TESTNET;
    if (chain === InContractChain.OKC) return Network.OKC_TESTNET;
    if (chain === InContractChain.GNOSIS) return Network.GNOSIS_CHIADO;
    if (chain === InContractChain.CELO) return Network.CELO_ALFAJORES;
    if (chain === InContractChain.HARMONY) return Network.HARMONY_TESTNET;
    if (chain === InContractChain.POLYGON_ZKEVM) return Network.POLYGON_ZKEVM_TESTNET;
    if (chain === InContractChain.MOONBEAM) return Network.MOONBASE_ALPHA;
    if (chain === InContractChain.MOONRIVER) return Network.MOONRIVER;
  }
  throw new Error(`Unsupported chain: ${chain}`);
};
