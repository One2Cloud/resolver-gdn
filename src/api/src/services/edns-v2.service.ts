import ContractAddress from "../../static/edns/contracts.json";
import NetworkConfig, { Net } from "../network-config";
import * as luxon from "luxon";
import { getProvider } from "../utils/get-provider";
import { createRedisClient } from "../utils/create-redis-client";
import { isValidFqdn } from "../utils/is-valid-fqdn";
import { extractFqdn } from "../utils/extract-fqdn";
import _ from "lodash";
import { BigNumber, ethers } from "ethers";
import { InvalidFqdnError } from "../errors/invalid-fqdn.error";
import { DomainNotFoundError } from "../errors/domain-not-found.error";
import {
  IGetMultiCoinAddressRecordOutput,
  IGetTextRecordOutput,
  IGetTypedTextRecordOutput,
  IGetNftRecordOutput,
  IGetDomainOutput,
  IGetHostOutput,
  IGetAddressRecordOutput,
  IEdnsResolverService,
} from "../interfaces/IEdnsResolverService.interface";
import { Registrar, IRegistry, PublicResolver, Registrar__factory, IRegistry__factory, PublicResolver__factory } from "../typechain/edns-v2/typechain";
import { IOptions } from "../interfaces/IOptions.interface";
import { IEdnsRegistryService } from "../interfaces/IEdnsRegistryService.interface";

const getContracts = (chainId: number): { Registrar: Registrar; Registry: IRegistry; Resolver: PublicResolver } => {
  const network = NetworkConfig[chainId];

  const contracts = ContractAddress.find((contract) => contract.chainId === network.chainId);

  if (contracts?.addresses["Registrar"] && contracts?.addresses["Registry.Diamond"] && contracts?.addresses["PublicResolver"]) {
    const provider = getProvider(network.chainId);
    const RegistrarContract = Registrar__factory.connect(contracts.addresses["Registrar"], provider);
    const ResolverContract = PublicResolver__factory.connect(contracts.addresses["PublicResolver"], provider);
    const RegistryContract = IRegistry__factory.connect(contracts.addresses["Registry.Diamond"], provider);
    // return {
    //   Registrar: Registrar__factory.connect(contracts.addresses["Registrar"], provider),
    //   Registry: IRegistry__factory.connect(contracts.addresses["Registry.Diamond"], provider),
    //   Resolver: PublicResolver__factory.connect(contracts.addresses["PublicResolver"], provider),
    // };
    console.log(ResolverContract);

    return {
      Registrar: RegistrarContract,
      Registry: RegistryContract,
      Resolver: ResolverContract,
    };
  } else {
    throw new Error("Unable to connect contract"); // TODO:
  }
};

export class EdnsV2FromRedisService implements IEdnsResolverService, IEdnsRegistryService {
  public async getAddressRecord(fqdn: string, options?: IOptions): Promise<IGetAddressRecordOutput | undefined> {
    const redis = createRedisClient();

    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);
    if (!(await this.isExists(fqdn, options))) throw new DomainNotFoundError(fqdn);

    const address = await redis.hget(`edns:${options?.net || Net.MAINNET}:host:${fqdn}:records`, "address");
    if (!address) return undefined;
    return { address };
  }

  public async getMultiCoinAddressRecord(fqdn: string, coin: string, options?: IOptions): Promise<IGetMultiCoinAddressRecordOutput | undefined> {
    const redis = createRedisClient();

    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);
    if (!(await this.isExists(fqdn, options))) throw new DomainNotFoundError(fqdn);

    const address = await redis.hget(`edns:${options?.net || Net.MAINNET}:host:${fqdn}:records`, `multi_coin_address:${coin}`);
    if (!address) return undefined;
    return { coin, address };
  }

  public async getTextRecord(fqdn: string, options?: IOptions): Promise<IGetTextRecordOutput | undefined> {
    const redis = createRedisClient();
    console.log("reach service");

    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);
    const res = await this.isExists(fqdn, options);

    if (!res) throw new DomainNotFoundError(fqdn);

    const text = await redis.hget(`edns:${options?.net || Net.MAINNET}:host:${fqdn}:records`, `text`);

    if (!text) return undefined;
    return { text };
  }

  public async getTypedTextRecord(fqdn: string, typed: string, options?: IOptions): Promise<IGetTypedTextRecordOutput | undefined> {
    const redis = createRedisClient();

    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);
    if (!(await this.isExists(fqdn, options))) throw new DomainNotFoundError(fqdn);

    const text = await redis.hget(`edns:${options?.net || Net.MAINNET}:host:${fqdn}:records`, `typed_text:${typed}`);
    if (!text) return undefined;
    return { text, typed };
  }

  public async getNftRecord(fqdn: string, chainId: string, options?: IOptions): Promise<IGetNftRecordOutput | undefined> {
    const redis = createRedisClient();
    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);
    if (!(await this.isExists(fqdn, options))) throw new DomainNotFoundError(fqdn);
    const result = await redis.hget(`edns:${options?.net || Net.MAINNET}:host:${fqdn}:records`, `text`);
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

  public async getDomainsByAccount(account: string, options?: IOptions): Promise<IGetDomainOutput[]> {
    const redis = createRedisClient();
    const _domains_ = await redis.smembers(`edns:${options?.net || Net.MAINNET}:account:${account}:domains`);
    const domains = await Promise.all(_domains_.map((d) => this.getDomain(d, options)));
    return domains.filter((d) => !!d) as IGetDomainOutput[];
  }

  public async getHost(fqdn: string, options?: IOptions): Promise<IGetHostOutput | undefined> {
    const redis = createRedisClient();
    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);
    if (!(await this.isExists(fqdn, options))) throw new DomainNotFoundError(fqdn);
    const results = await redis
      .pipeline()
      .hget(`edns:${options?.net || Net.MAINNET}:host:${fqdn}:user`, "user")
      .hget(`edns:${options?.net || Net.MAINNET}:host:${fqdn}:user`, "expiry")
      .smembers(`edns:${options?.net || Net.MAINNET}:hosts:${fqdn}:operators`)
      .smembers(`edns:${options?.net || Net.MAINNET}:hosts:${fqdn}:records:list`)
      .exec();

    if (!results) return undefined;

    return {
      user: {
        address: results[0][1] as string,
        expiry: luxon.DateTime.fromSeconds(parseInt(results[1][1] as string)),
      },
      operators: results[2][1] as string[],
      records: results[3][1] as string[],
    };
  }
}

export class EdnsV2FromContractService implements IEdnsResolverService, IEdnsRegistryService {
  private async _getDomainChainId(domain: string, options?: IOptions): Promise<number> {
    const redis = createRedisClient();
    const result = await redis.hget(`edns:${options?.net || Net.MAINNET}:domain:${domain}:info`, "chain");
    console.log(`edns:${options?.net || Net.MAINNET}:domain:${domain}:info`);
    if (!result) throw new Error("Unable to get Chain ID"); //TODO:
    return parseInt(result);
  }

  public async getAddressRecord(fqdn: string, options?: IOptions): Promise<IGetAddressRecordOutput | undefined> {
    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);
    const isExists = await this.isExists(fqdn, options);
    console.log({ isExists });
    if (!isExists) throw new DomainNotFoundError(fqdn);
    const _chainId = options?.chainId || (await this._getDomainChainId(fqdn, options));
    const contracts = getContracts(_chainId);
    const { host, name, tld } = extractFqdn(fqdn);

    if (host && name && tld) {
      return {
        address: await contracts.Resolver.getAddress(ethers.utils.toUtf8Bytes(host), ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld)),
      };
    } else if (name && tld) {
      return {
        address: await contracts.Resolver.getAddress(ethers.utils.toUtf8Bytes("@"), ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld)),
      };
    }
    return undefined;
  }

  public async getMultiCoinAddressRecord(fqdn: string, coin: string, options?: IOptions): Promise<IGetMultiCoinAddressRecordOutput | undefined> {
    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);
    if (!(await this.isExists(fqdn, options))) throw new DomainNotFoundError(fqdn);

    const _chainId = options?.chainId || (await this._getDomainChainId(fqdn, options));
    const contracts = getContracts(_chainId);

    const { host, name, tld } = extractFqdn(fqdn);
    if (host && name && tld) {
      return {
        coin,
        address: await contracts.Resolver.getMultiCoinAddress(ethers.utils.toUtf8Bytes(host), ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld), BigNumber.from(coin)),
      };
    } else if (name && tld) {
      return {
        coin,
        address: await contracts.Resolver.getMultiCoinAddress(ethers.utils.toUtf8Bytes("@"), ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld), BigNumber.from(coin)),
      };
    }
    return undefined;
  }

  public async getTextRecord(fqdn: string, options?: IOptions): Promise<IGetTextRecordOutput | undefined> {
    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);
    if (!(await this.isExists(fqdn, options))) throw new DomainNotFoundError(fqdn);

    const _chainId = options?.chainId || (await this._getDomainChainId(fqdn, options));
    const contracts = getContracts(_chainId);

    const { host, name, tld } = extractFqdn(fqdn);
    if (host && name && tld) {
      return {
        text: await contracts.Resolver.getText(ethers.utils.toUtf8Bytes(host), ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld)),
      };
    } else if (name && tld) {
      return {
        text: await contracts.Resolver.getText(ethers.utils.toUtf8Bytes("@"), ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld)),
      };
    }
    return undefined;
  }

  public async getTypedTextRecord(fqdn: string, typed: string, options?: IOptions): Promise<IGetTypedTextRecordOutput | undefined> {
    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);
    if (!(await this.isExists(fqdn, options))) throw new DomainNotFoundError(fqdn);

    const _chainId = options?.chainId || (await this._getDomainChainId(fqdn, options));
    const contracts = getContracts(_chainId);
    const _typed = ethers.utils.toUtf8Bytes(typed);

    const { host, name, tld } = extractFqdn(fqdn);
    if (host && name && tld) {
      return {
        typed,
        text: await contracts.Resolver.getTypedText(ethers.utils.toUtf8Bytes(host), ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld), _typed),
      };
    } else if (name && tld) {
      return {
        typed,
        text: await contracts.Resolver.getTypedText(ethers.utils.toUtf8Bytes("@"), ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld), _typed),
      };
    }
    return undefined;
  }

  public async getNftRecord(fqdn: string, chainId: string, options?: IOptions): Promise<IGetNftRecordOutput | undefined> {
    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);
    if (!(await this.isExists(fqdn, options))) throw new DomainNotFoundError(fqdn);

    const _chainId = options?.chainId || (await this._getDomainChainId(fqdn, options));
    const contracts = getContracts(_chainId);

    const { host, name, tld } = extractFqdn(fqdn);
    if (host && name && tld) {
      const [contractAddress, tokenId] = await contracts.Resolver.getNFT(ethers.utils.toUtf8Bytes(host), ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld), chainId);
      return {
        chainId,
        contractAddress,
        tokenId: `${tokenId.toNumber()}`,
      };
    } else if (name && tld) {
      const [contractAddress, tokenId] = await contracts.Resolver.getNFT(ethers.utils.toUtf8Bytes("@"), ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld), chainId);
      return {
        chainId,
        contractAddress,
        tokenId: `${tokenId.toNumber()}`,
      };
    }
    return undefined;
  }

  public async isExists(fqdn: string, options?: IOptions): Promise<boolean> {
    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);

    const _chainId = options?.chainId || (await this._getDomainChainId(fqdn, options));
    const contracts = getContracts(_chainId);

    const { host, name, tld } = extractFqdn(fqdn);
    if (host && name && tld) {
      return await contracts.Registry["isExists(bytes32,bytes32,bytes32)"](
        ethers.utils.solidityKeccak256(["string"], [host]),
        ethers.utils.solidityKeccak256(["string"], [name]),
        ethers.utils.solidityKeccak256(["string"], [tld]),
      );
    } else if (name && tld) {
      return await contracts.Registry["isExists(bytes32,bytes32)"](ethers.utils.solidityKeccak256(["string"], [name]), ethers.utils.solidityKeccak256(["string"], [tld]));
    } else {
      return await contracts.Registry["isExists(bytes32)"](ethers.utils.keccak256(tld));
    }
  }

  public async getDomain(fqdn: string, options?: IOptions): Promise<IGetDomainOutput | undefined> {
    return new EdnsV2FromRedisService().getDomain(fqdn, options);
  }

  public async getDomainsByAccount(account: string, options?: IOptions): Promise<IGetDomainOutput[]> {
    return new EdnsV2FromRedisService().getDomainsByAccount(account, options);
  }

  public async getHost(fqdn: string, options?: IOptions): Promise<IGetHostOutput | undefined> {
    return new EdnsV2FromRedisService().getHost(fqdn, options);
  }
}
