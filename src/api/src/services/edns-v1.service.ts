import { getProvider } from "../utils/get-provider";
import { Net, Network } from "../network-config";
import { BigNumber, ethers } from "ethers";
import { DomainNotFoundError } from "../errors/domain-not-found.error";
import { IOptions } from "../interfaces/IOptions.interface";
import { namehash } from "../utils/namehash";
import {
  IEdnsResolverService,
  IGetAddressRecordInput,
  IGetAddressRecordOutput,
  IGetMultiCoinAddressRecordInput,
  IGetMultiCoinAddressRecordOutput,
  IGetNftRecordInput,
  IGetNftRecordOutput,
  IGetReverseAddressRecordInput,
  IGetReverseAddressRecordOutput,
  IGetTextRecordInput,
  IGetTextRecordOutput,
  IGetTypedTextRecordInput,
  IGetTypedTextRecordOutput,
} from "../interfaces/IEdnsResolverService.interface";
import { PublicResolver__factory } from "../typechain/edns-v1/typechain/factories/PublicResolver__factory";
import { EDNSRegistry__factory } from "../typechain/edns-v1/typechain/factories/EDNSRegistry__factory";
import { PublicResolver } from "../typechain/edns-v1/typechain/PublicResolver";
import { EDNSRegistry } from "../typechain/edns-v1/typechain/EDNSRegistry";
import { ReverseRegistrar__factory } from "../typechain/edns-v1/typechain/factories/ReverseRegistrar__factory";
import { ReverseRegistrar } from "../typechain/edns-v1/typechain/ReverseRegistrar";
import { MissingChainIdError } from "../errors/missing-chain-id.error";

export class EdnsV1FromContractService implements IEdnsResolverService {
  private _getProvider(fqdn: string, net: Net): ethers.providers.JsonRpcProvider {
    if (fqdn.endsWith("iotex")) {
      if (net === Net.MAINNET) {
        return getProvider(Network.IOTEX);
      } else {
        return getProvider(Network.IOTEX_TESTNET);
      }
    }
    if (net === Net.MAINNET) {
      return getProvider(Network.POLYGON);
    } else {
      return getProvider(Network.GOERLI);
    }
  }

  private _getContract(provider: ethers.providers.JsonRpcProvider): { resolver: PublicResolver; registry: EDNSRegistry; reverse_registrar: ReverseRegistrar } {
    let _RESOLVER_ADDRESS_: string | undefined;
    let _REGISTRY_ADDRESS_: string | undefined;
    let _REVERSE_REGISTRAR_ADDRESS_: string | undefined;
    if (provider.network.chainId === Network.GOERLI) {
      _RESOLVER_ADDRESS_ = "0x87EEBE3c2bEDE909A9825977df5E852Df3314BcF";
      _REGISTRY_ADDRESS_ = "0x467cfd51c227b334D8c71d843BCE54b235092a66";
      _REVERSE_REGISTRAR_ADDRESS_ = "0x5716EBAe036AE2c3652902dd89EeD1c73c74384D";
    }
    if (provider.network.chainId === Network.POLYGON) {
      _RESOLVER_ADDRESS_ = "0x3c2DAab0AF88B0c5505ccB585e04FB33d7C80144";
      _REGISTRY_ADDRESS_ = "0x7c5DbFE487D01BC0C75704dBfD334198E6AB2D12";
      _REVERSE_REGISTRAR_ADDRESS_ = "0xD986F9083F006D0E2d08c9F22247b4a0a213146D";
    }
    if (provider.network.chainId === Network.IOTEX_TESTNET) {
      _RESOLVER_ADDRESS_ = "0x0bd951d7B58ea94dB153cEF60336012FB9d466eA";
      _REGISTRY_ADDRESS_ = "0xa1eD26c554fCa24DABdfda8c690785cd4DE50b7c";
      _REVERSE_REGISTRAR_ADDRESS_ = "0xCDEbE246529e6c5f549b08dC8DC9a720A34C3149";
    }
    if (provider.network.chainId === Network.IOTEX) {
      _RESOLVER_ADDRESS_ = "0x4ECAafcc6Aa082F14C98e2bC7A37a35Dc30B13C5";
      _REGISTRY_ADDRESS_ = "0x6CfcCD07f5461755E1a02E00CDaEEdf2bC2A5Eed";
      _REVERSE_REGISTRAR_ADDRESS_ = "0xaE2e725957f7EA2a5A5D7f73301ed5c3B23B06AA";
    }
    if (!_RESOLVER_ADDRESS_ || !_REGISTRY_ADDRESS_ || !_REVERSE_REGISTRAR_ADDRESS_) throw new Error("UNSUPPORTED_CHAIN");
    const resolver = PublicResolver__factory.connect(_RESOLVER_ADDRESS_, provider);
    const registry = EDNSRegistry__factory.connect(_REGISTRY_ADDRESS_, provider);
    const reverse_registrar = ReverseRegistrar__factory.connect(_REVERSE_REGISTRAR_ADDRESS_, provider);
    return { resolver, registry, reverse_registrar };
  }

  public async getReverseAddressRecord(input: IGetReverseAddressRecordInput, options?: IOptions): Promise<IGetReverseAddressRecordOutput | undefined> {
    if (!options?.chainId) throw new MissingChainIdError();
    const provider = getProvider(options.chainId);
    const { reverse_registrar, resolver } = this._getContract(provider);
    const node = await reverse_registrar.node(input.address);
    const fqdn = await resolver.name(node);
    if (fqdn) return { fqdn };
    return undefined;
  }

  public async getAddressRecord(input: IGetAddressRecordInput, options?: IOptions): Promise<IGetAddressRecordOutput | undefined> {
    const provider = this._getProvider(input.fqdn, options?.net || Net.MAINNET);
    const { resolver, registry } = this._getContract(provider);
    const hash = namehash(input.fqdn);
    if (!(await registry.recordExists(hash))) throw new DomainNotFoundError(input.fqdn);
    return { address: await resolver["addr(bytes32)"](hash) };
  }

  public async getMultiCoinAddressRecord(input: IGetMultiCoinAddressRecordInput, options?: IOptions): Promise<IGetMultiCoinAddressRecordOutput | undefined> {
    const provider = this._getProvider(input.fqdn, options?.net || Net.MAINNET);
    const { resolver, registry } = this._getContract(provider);
    const hash = namehash(input.fqdn);
    if (!(await registry.recordExists(hash))) throw new DomainNotFoundError(input.fqdn);
    return { coin: input.coin, address: await resolver["addr(bytes32,uint256)"](hash, BigNumber.from(input.coin)) };
  }

  public async getTextRecord(input: IGetTextRecordInput, options?: IOptions): Promise<IGetTextRecordOutput | undefined> {
    throw new Error("UNSUPPORTED_FEATURES");
  }

  public async getTypedTextRecord(input: IGetTypedTextRecordInput, options?: IOptions): Promise<IGetTypedTextRecordOutput | undefined> {
    const provider = this._getProvider(input.fqdn, options?.net || Net.MAINNET);
    const { resolver, registry } = this._getContract(provider);
    const hash = namehash(input.fqdn);
    if (!(await registry.recordExists(hash))) throw new DomainNotFoundError(input.fqdn);
    return { typed: input.typed, text: await resolver.text(hash, input.typed) };
  }

  public async getNftRecord(input: IGetNftRecordInput, options?: IOptions): Promise<IGetNftRecordOutput | undefined> {
    const provider = this._getProvider(input.fqdn, options?.net || Net.MAINNET);
    const { resolver, registry } = this._getContract(provider);
    const hash = namehash(input.fqdn);
    if (!(await registry.recordExists(hash))) throw new DomainNotFoundError(input.fqdn);
    const [_chainId, _contractAddress, _tokenId] = await resolver.getNFT(hash, input.chainId);
    return { chainId: input.chainId, contractAddress: _contractAddress, tokenId: `${_tokenId.toNumber()}` };
  }

  public async isExists(fqdn: string, options?: IOptions): Promise<boolean> {
    const provider = this._getProvider(fqdn, options?.net || Net.MAINNET);
    const { registry } = this._getContract(provider);
    const hash = namehash(fqdn);
    return registry.recordExists(hash);
  }
}
