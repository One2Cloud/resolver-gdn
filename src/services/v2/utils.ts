import ContractAddress from "../../static/edns-contracts-address.json";
import { getNetworkConfig } from "../../network-config";
import { getProvider } from "../../utils/get-provider";
import _ from "lodash";
import { Registrar, IRegistry, PublicResolver, Registrar__factory, IRegistry__factory, PublicResolver__factory } from "../../contracts/ethereum/edns-v2/typechain";
import { CantConnectContractError } from "../../errors/cant-connect-contract.error";

export const getContracts = async (chainId: number): Promise<{ Registrar: Registrar; Registry: IRegistry; Resolver: PublicResolver }> => {
  const NetworkConfig = await getNetworkConfig();

  const network = NetworkConfig[chainId];
  const contracts = ContractAddress.find((contract) => contract.chainId === network.chainId);
  if (contracts?.addresses["Registrar"] && contracts?.addresses["Registry.Diamond"] && contracts?.addresses["PublicResolver"]) {
    try {
      const provider = await getProvider(network.chainId);
      const RegistrarContract = Registrar__factory.connect(contracts.addresses["Registrar"], provider);
      const ResolverContract = PublicResolver__factory.connect(contracts.addresses["PublicResolver"], provider);
      const RegistryContract = IRegistry__factory.connect(contracts.addresses["Registry.Diamond"], provider);
      return {
        Registrar: RegistrarContract,
        Registry: RegistryContract,
        Resolver: ResolverContract,
      };
    } catch (error) {
      console.error({ error });
      throw new CantConnectContractError(chainId);
    }
  } else {
    throw new CantConnectContractError(chainId);
  }
};
