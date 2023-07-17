import { getProvider } from "../utils/get-provider";
import { Net, Network } from "../network-config";
import { BigNumber, ethers } from "ethers";
import { DomainNotFoundError } from "../errors/domain-not-found.error";
import { IOptions } from "../interfaces/IOptions.interface";
import { namehash } from "../utils/namehash";
import {
  IEdnsResolverService,
  IGetDomainOutput,
  IGetMultiCoinAddressRecordOutput,
  IGetNftRecordOutput,
  IGetTextRecordOutput,
  IGetTypedTextRecordOutput,
} from "../interfaces/IEdnsResolverService.interface";
import { createRedisClient } from "../utils/create-redis-client";
import { isValidFqdn } from "../utils/is-valid-fqdn";
import { InvalidFqdnError } from "../errors/invalid-fqdn.error";
import { extractFqdn } from "../utils/extract-fqdn";
import luxon from "luxon";
import { PublicResolver__factory } from "../typechain/edns-v1/typechain/factories/PublicResolver__factory";
import { EDNSRegistry__factory } from "../typechain/edns-v1/typechain/factories/EDNSRegistry__factory";
import { PublicResolver } from "../typechain/edns-v1/typechain/PublicResolver";
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

  public async getDomain(address: string, options?: IOptions): Promise<IGetDomainOutput | undefined> {
    return new EdnsV1FromContractService().getDomain(address, options);
  }
}

export class EdnsV1FromRedisService implements IEdnsResolverService {
  public async getAddressRecord(fqdn: string, options?: IOptions | undefined): Promise<IGetAddressRecordOutput | undefined> {
    const redis = createRedisClient();

    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);
    if (!(await this.isExists(fqdn, options))) throw new DomainNotFoundError(fqdn);

    const address = await redis.hget(`edns:${options?.net || Net.MAINNET}:host:${fqdn}:records`, "address");
    if (!address) return undefined;
    return { address };
  }

  public async getMultiCoinAddressRecord(fqdn: string, coin: string, options?: IOptions | undefined): Promise<IGetMultiCoinAddressRecordOutput | undefined> {
    const redis = createRedisClient();

    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);
    if (!(await this.isExists(fqdn, options))) throw new DomainNotFoundError(fqdn);

    const address = await redis.hget(`edns:${options?.net || Net.MAINNET}:host:${fqdn}:records`, `multi_coin_address:${coin}`);
    if (!address) return undefined;
    return { coin, address };
  }

  public async getTextRecord(fqdn: string, options?: IOptions | undefined): Promise<IGetTextRecordOutput | undefined> {
    throw new Error("UNSUPPORTED_FEATURES");
  }

  public async getTypedTextRecord(fqdn: string, typed: string, options?: IOptions | undefined): Promise<IGetTypedTextRecordOutput | undefined> {
    const redis = createRedisClient();

    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);
    if (!(await this.isExists(fqdn, options))) throw new DomainNotFoundError(fqdn);

    const text = await redis.hget(`edns:${options?.net || Net.MAINNET}:host:${fqdn}:records`, `typed_text:${typed}`);
    if (!text) return undefined;
    return { text, typed };
  }

  public async getNftRecord(fqdn: string, chainId: string, options?: IOptions | undefined): Promise<IGetNftRecordOutput | undefined> {
    const redis = createRedisClient();
    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);
    if (!(await this.isExists(fqdn, options))) throw new DomainNotFoundError(fqdn);
    const result = await redis.hget(`edns:${options?.net || Net.MAINNET}:host:${fqdn}:records`, `nft`);
    if (!result) return undefined;
    const [contractAddress, tokenId] = result.split(":");
    return { contractAddress, tokenId, chainId };
  }

  public async isExists(fqdn: string, options?: IOptions): Promise<boolean> {
    const redis = createRedisClient();

    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);

    const { host, name, tld } = extractFqdn(fqdn);
    if (host && name && tld) {
      return !!(await redis.exists(`edns:${options?.net || Net.MAINNET}:host:${fqdn}:info`));
    } else if (name && tld) {
      return !!(await redis.exists(`edns:${options?.net || Net.MAINNET}:domain:${name}.${tld}:info`));
    } else {
      return true; // TODO:
    }
  }

  public async getDomain(fqdn: string, options?: IOptions): Promise<IGetDomainOutput | undefined> {
    const redis = createRedisClient();

    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);
    if (!(await this.isExists(fqdn, options))) throw new DomainNotFoundError(fqdn);

    const { name, tld } = extractFqdn(fqdn);
    if (!name) throw new Error(""); //TODO:
    const _domain = `${name}.${tld}`;

    const results = await redis
      .pipeline()
      .hget(`edns:${options?.net || Net.MAINNET}:domain:${_domain}:info`, "owner")
      .hget(`edns:${options?.net || Net.MAINNET}:domain:${_domain}:info`, "expiry")
      .hget(`edns:${options?.net || Net.MAINNET}:domain:${_domain}:info`, "chain")
      .hget(`edns:${options?.net || Net.MAINNET}:domain:${_domain}:info`, "resolver")
      .hget(`edns:${options?.net || Net.MAINNET}:domain:${_domain}:user`, "user")
      .hget(`edns:${options?.net || Net.MAINNET}:domain:${_domain}:user`, "expiry")
      .smembers(`edns:${options?.net || Net.MAINNET}:domain:${_domain}:operators`)
      .smembers(`edns:${options?.net || Net.MAINNET}:domain:${_domain}:hosts`)
      .exec();

    if (!results) return undefined;

    return {
      owner: results[0][1] as string,
      expiry: luxon.DateTime.fromSeconds(parseInt(results[1][1] as string)),
      chain: parseInt(results[2][1] as string),
      resolver: results[3][1] as string,
      user: {
        address: results[4][1] as string,
        expiry: luxon.DateTime.fromSeconds(parseInt(results[5][1] as string)),
      },
      operators: results[6][1] as string[],
      hosts: results[7][1] as string[],
    };
  }
}
