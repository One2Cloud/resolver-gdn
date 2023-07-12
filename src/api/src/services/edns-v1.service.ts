import { getProvider } from "../utils/get-provider";
import { Net, Network } from "../network-config";
import { BigNumber, ethers } from "ethers";
import { DomainNotFoundError } from "../errors/domain-not-found.error";
import { IOptions } from "../interfaces/IOptions.interface";
import { namehash } from "../utils/namehash";
import {
  IEdnsResolverService,
  IGetMultiCoinAddressRecordOutput,
  IGetNftRecordOutput,
  IGetTextRecordOutput,
  IGetTypedTextRecordOutput,
} from "../interfaces/IEdnsResolverService.interface";
import { EDNSRegistry__factory, PublicResolver, PublicResolver__factory } from "../typechain/edns-v1/typechain";
import { EDNSRegistry } from "../typechain/edns-v1/typechain/EDNSRegistry";

export interface IGetAddressRecordOutput {
  address: string;
}

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

  private _getContract(provider: ethers.providers.JsonRpcProvider): { resolver: PublicResolver; registry: EDNSRegistry } {
    let _RESOLVER_ADDRESS_: string | undefined;
    let _REGISTRY_ADDRESS_: string | undefined;
    if (provider.network.chainId === Network.GOERLI) {
      _RESOLVER_ADDRESS_ = "0x87EEBE3c2bEDE909A9825977df5E852Df3314BcF";
      _REGISTRY_ADDRESS_ = "0x467cfd51c227b334D8c71d843BCE54b235092a66";
    }
    if (provider.network.chainId === Network.POLYGON) {
      _RESOLVER_ADDRESS_ = "0x3c2DAab0AF88B0c5505ccB585e04FB33d7C80144";
      _REGISTRY_ADDRESS_ = "0x7c5DbFE487D01BC0C75704dBfD334198E6AB2D12";
    }
    if (provider.network.chainId === Network.IOTEX_TESTNET) {
      _RESOLVER_ADDRESS_ = "0x0bd951d7B58ea94dB153cEF60336012FB9d466eA";
      _REGISTRY_ADDRESS_ = "0xa1eD26c554fCa24DABdfda8c690785cd4DE50b7c";
    }
    if (provider.network.chainId === Network.IOTEX) {
      _RESOLVER_ADDRESS_ = "0x4ECAafcc6Aa082F14C98e2bC7A37a35Dc30B13C5";
      _REGISTRY_ADDRESS_ = "0x6CfcCD07f5461755E1a02E00CDaEEdf2bC2A5Eed";
    }
    if (!_RESOLVER_ADDRESS_ || !_REGISTRY_ADDRESS_) throw new Error("UNSUPPORTED_CHAIN");
    const resolver = PublicResolver__factory.connect(_RESOLVER_ADDRESS_, provider);
    const registry = EDNSRegistry__factory.connect(_REGISTRY_ADDRESS_, provider);
    return { resolver, registry };
  }

  public async getAddressRecord(fqdn: string, options?: IOptions): Promise<IGetAddressRecordOutput | undefined> {
    const provider = this._getProvider(fqdn, options?.net || Net.MAINNET);
    const { resolver, registry } = this._getContract(provider);
    const hash = namehash(fqdn);
    if (!(await registry.recordExists(hash))) throw new DomainNotFoundError(fqdn);
    return { address: await resolver["addr(bytes32)"](hash) };
  }

  public async getMultiCoinAddressRecord(fqdn: string, coin: string, options?: IOptions): Promise<IGetMultiCoinAddressRecordOutput | undefined> {
    const provider = this._getProvider(fqdn, options?.net || Net.MAINNET);
    const { resolver, registry } = this._getContract(provider);
    const hash = namehash(fqdn);
    if (!(await registry.recordExists(hash))) throw new DomainNotFoundError(fqdn);
    return { coin, address: await resolver["addr(bytes32,uint256)"](hash, BigNumber.from(coin)) };
  }

  public async getTextRecord(fqdn: string, options?: IOptions): Promise<IGetTextRecordOutput | undefined> {
    throw new Error("UNSUPPORTED_FEATURES");
  }

  public async getTypedTextRecord(fqdn: string, typed: string, options?: IOptions): Promise<IGetTypedTextRecordOutput | undefined> {
    const provider = this._getProvider(fqdn, options?.net || Net.MAINNET);
    const { resolver, registry } = this._getContract(provider);
    const hash = namehash(fqdn);
    if (!(await registry.recordExists(hash))) throw new DomainNotFoundError(fqdn);
    return { typed, text: await resolver.text(hash, typed) };
  }

  public async getNftRecord(fqdn: string, chainId: string, options?: IOptions): Promise<IGetNftRecordOutput | undefined> {
    const provider = this._getProvider(fqdn, options?.net || Net.MAINNET);
    const { resolver, registry } = this._getContract(provider);
    const hash = namehash(fqdn);
    if (!(await registry.recordExists(hash))) throw new DomainNotFoundError(fqdn);
    const [_chainId, _contractAddress, _tokenId] = await resolver.getNFT(hash, chainId);
    return { chainId, contractAddress: _contractAddress, tokenId: `${_tokenId.toNumber()}` };
  }

  public async isExists(fqdn: string, options?: IOptions): Promise<boolean> {
    const provider = this._getProvider(fqdn, options?.net || Net.MAINNET);
    const { registry } = this._getContract(provider);
    const hash = namehash(fqdn);
    return registry.recordExists(hash);
  }
}
