import ContractAddress from "../../static/edns-contracts-address.json";
import { getNetworkConfig, Net } from "../../network-config";
import * as luxon from "luxon";
import { getProvider } from "../../utils/get-provider";
import { createRedisClient } from "../../utils/create-redis-client";
import { isValidFqdn } from "../../utils/is-valid-fqdn";
import { extractFqdn } from "../../utils/extract-fqdn";
import _ from "lodash";
import { BigNumber, ethers } from "ethers";
import { InvalidFqdnError } from "../../errors/invalid-fqdn.error";
import { DomainNotFoundError } from "../../errors/domain-not-found.error";
import {
  IGetMultiCoinAddressRecordOutput,
  IGetTextRecordOutput,
  IGetTypedTextRecordOutput,
  IGetNftRecordOutput,
  IGetAddressRecordOutput,
  IEdnsResolverService,
  IGetAddressRecordInput,
  IGetMultiCoinAddressListOutput,
  IGetMultiCoinAddressRecordInput,
  IGetTypedTextRecordInput,
  IGetNftRecordInput,
  IGetTextRecordInput,
  IGetReverseAddressRecordInput,
  IGetReverseAddressRecordOutput,
  IGetBridgedEventInput,
  IGetTypedTextListOutput,
  IGetAllRecordsInput,
  IGetAllRecordsOutput,
  IGetUrlRecordOutput,
} from "../../interfaces/IEdnsResolverService.interface";
import { Registrar, IRegistry, PublicResolver, Registrar__factory, IRegistry__factory, PublicResolver__factory } from "../../contracts/ethereum/edns-v2/typechain";
import { IOptions } from "../../interfaces/IOptions.interface";
import { IEdnsRegistryService, IGetDomainOutput, IGetDomainOutputSubgraph, IGetHostOutput } from "../../interfaces/IEdnsRegistryService.interface";
import { CantConnectContractError } from "../../errors/cant-connect-contract.error";
import { CantGetDomainNameError } from "../../errors/cant-get-domain-name.error";
import { CantGetChainIdError } from "../../errors/cant-get-chain-id.error";
import { MissingChainIdError } from "../../errors/missing-chain-id.error";
import { timeIsPassed } from "../../utils/time-is-passed";
import { DomainExpiredError } from "../../errors/domain-expired.error";
import { getChainId } from "../../utils/get-chain-id";
import { ZERO_ADDRESS } from "../../network-config";
import { Key } from "../../app/listener/handler";
import { url } from "inspector";
import { createClient, cacheExchange, fetchExchange } from "urql";
import config from "../../config";

export const getContracts = (chainId: number): { Registrar: Registrar; Registry: IRegistry; Resolver: PublicResolver } => {
  const NetworkConfig = getNetworkConfig();

  const network = NetworkConfig[chainId];
  const contracts = ContractAddress.find((contract) => contract.chainId === network.chainId);
  if (contracts?.addresses["Registrar"] && contracts?.addresses["Registry.Diamond"] && contracts?.addresses["PublicResolver"]) {
    try {
      const provider = getProvider(network.chainId);
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
