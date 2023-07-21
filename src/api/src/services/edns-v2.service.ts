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
  IGetAddressRecordOutput,
  IEdnsResolverService,
  IGetAddressRecordInput,
  IGetMultiCoinAddressRecordInput,
  IGetTypedTextRecordInput,
  IGetNftRecordInput,
  IGetTextRecordInput,
  IGetReverseAddressRecordInput,
  IGetReverseAddressRecordOutput,
} from "../interfaces/IEdnsResolverService.interface";
import { Registrar, IRegistry, PublicResolver, Registrar__factory, IRegistry__factory, PublicResolver__factory } from "../typechain/edns-v2/typechain";
import { IOptions } from "../interfaces/IOptions.interface";
import { IEdnsRegistryService, IGetDomainOutput, IGetHostOutput } from "../interfaces/IEdnsRegistryService.interface";

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
    // console.log(ResolverContract);

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
  public async getReverseAddressRecord(input: IGetReverseAddressRecordInput, options?: IOptions): Promise<IGetReverseAddressRecordOutput | undefined> {
    const redis = createRedisClient();

    const fqdn = await redis.get(`edns:${options?.net || Net.MAINNET}:account:${input.address}:reverse_domain`);
    if (!fqdn) return undefined;
    return { fqdn };
  }

  public async getAddressRecord(input: IGetAddressRecordInput, options?: IOptions): Promise<IGetAddressRecordOutput | undefined> {
    const redis = createRedisClient();

    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);
    if (!(await this.isExists(input.fqdn, options))) throw new DomainNotFoundError(input.fqdn);

    const address = await redis.hget(`edns:${options?.net || Net.MAINNET}:host:${input.fqdn}:records`, "address");
    if (!address) return undefined;
    return { address };
  }

  public async getMultiCoinAddressRecord(input: IGetMultiCoinAddressRecordInput, options?: IOptions): Promise<IGetMultiCoinAddressRecordOutput | undefined> {
    const redis = createRedisClient();

    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);
    if (!(await this.isExists(input.fqdn, options))) throw new DomainNotFoundError(input.fqdn);

    const address = await redis.hget(`edns:${options?.net || Net.MAINNET}:host:${input.fqdn}:records`, `multi_coin_address:${input.coin}`);
    if (!address) return undefined;
    return { coin: input.coin, address };
  }

  public async getTextRecord(input: IGetTextRecordInput, options?: IOptions): Promise<IGetTextRecordOutput | undefined> {
    const redis = createRedisClient();

    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);
    const res = await this.isExists(input.fqdn, options);

    if (!res) throw new DomainNotFoundError(input.fqdn);

    const text = await redis.hget(`edns:${options?.net || Net.MAINNET}:host:${input.fqdn}:records`, `text`);

    if (!text) return undefined;
    return { text };
  }

  public async getTypedTextRecord(input: IGetTypedTextRecordInput, options?: IOptions): Promise<IGetTypedTextRecordOutput | undefined> {
    const redis = createRedisClient();

    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);
    if (!(await this.isExists(input.fqdn, options))) throw new DomainNotFoundError(input.fqdn);

    const text = await redis.hget(`edns:${options?.net || Net.MAINNET}:host:${input.fqdn}:records`, `typed_text:${input.typed}`);
    if (!text) return undefined;
    return { text, typed: input.typed };
  }

  public async getNftRecord(input: IGetNftRecordInput, options?: IOptions): Promise<IGetNftRecordOutput | undefined> {
    const redis = createRedisClient();
    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);
    if (!(await this.isExists(input.fqdn, options))) throw new DomainNotFoundError(input.fqdn);
    const result = await redis.hget(`edns:${options?.net || Net.MAINNET}:host:${input.fqdn}:records`, `text`);
    if (!result) return undefined;
    const [contractAddress, tokenId] = result.split(":");
    return { contractAddress, tokenId, chainId: input.chainId };
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
      .hget(`edns:${options?.net || Net.MAINNET}:domain:${_domain}:info`, "bridging")
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
      bridging: (results[4][1] as string) === "1",
      user: {
        address: results[5][1] as string,
        expiry: luxon.DateTime.fromSeconds(parseInt(results[6][1] as string)),
      },
      operators: results[7][1] as string[],
      hosts: results[8][1] as string[],
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
    // console.log(`await redis.hget(edns:${options?.net || Net.MAINNET}:domain:${domain}:info, "chain");`)
    if (!result) throw new Error("Unable to get Chain ID"); //TODO:
    return parseInt(result);
  }

  public async getReverseAddressRecord(input: IGetReverseAddressRecordInput, options?: IOptions): Promise<IGetReverseAddressRecordOutput | undefined> {
    if (!options?.chainId) throw new Error(""); //TODO:
    const contracts = getContracts(options.chainId);

    const fqdn = await contracts.Resolver.getReverseAddress(input.address);
    if (fqdn) return { fqdn };
    return undefined;
  }

  public async getAddressRecord(input: IGetAddressRecordInput, options?: IOptions): Promise<IGetAddressRecordOutput | undefined> {
    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);

    const _chainId = options?.chainId || (await this._getDomainChainId(input.fqdn, options));
    if (!(await this.isExists(input.fqdn, options, _chainId))) throw new DomainNotFoundError(input.fqdn);
    
    const contracts = getContracts(_chainId);

    const { host, name, tld } = extractFqdn(input.fqdn);
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

  public async getMultiCoinAddressRecord(input: IGetMultiCoinAddressRecordInput, options?: IOptions): Promise<IGetMultiCoinAddressRecordOutput | undefined> {
    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);

    const _chainId = options?.chainId || (await this._getDomainChainId(input.fqdn, options));
    if (!(await this.isExists(input.fqdn, options, _chainId))) throw new DomainNotFoundError(input.fqdn);
    
    const contracts = getContracts(_chainId);

    const { host, name, tld } = extractFqdn(input.fqdn);
    if (host && name && tld) {
      return {
        coin: input.coin,
        address: await contracts.Resolver.getMultiCoinAddress(
          ethers.utils.toUtf8Bytes(host),
          ethers.utils.toUtf8Bytes(name),
          ethers.utils.toUtf8Bytes(tld),
          BigNumber.from(input.coin),
        ),
      };
    } else if (name && tld) {
      return {
        coin: input.coin,
        address: await contracts.Resolver.getMultiCoinAddress(
          ethers.utils.toUtf8Bytes("@"),
          ethers.utils.toUtf8Bytes(name),
          ethers.utils.toUtf8Bytes(tld),
          BigNumber.from(input.coin),
        ),
      };
    }
    return undefined;
  }

  public async getTextRecord(input: IGetTextRecordInput, options?: IOptions): Promise<IGetTextRecordOutput | undefined> {
    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);

    const _chainId = options?.chainId || (await this._getDomainChainId(input.fqdn, options));
    if (!(await this.isExists(input.fqdn, options, _chainId))) throw new DomainNotFoundError(input.fqdn);

    const contracts = getContracts(_chainId);

    const { host, name, tld } = extractFqdn(input.fqdn);
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

  public async getTypedTextRecord(input: IGetTypedTextRecordInput, options?: IOptions): Promise<IGetTypedTextRecordOutput | undefined> {
    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);

    const _chainId = options?.chainId || (await this._getDomainChainId(input.fqdn, options));
    if (!(await this.isExists(input.fqdn, options, _chainId))) throw new DomainNotFoundError(input.fqdn);

    const contracts = getContracts(_chainId);
    const _typed = ethers.utils.toUtf8Bytes(input.typed);

    const { host, name, tld } = extractFqdn(input.fqdn);
    if (host && name && tld) {
      return {
        typed: input.typed,
        text: await contracts.Resolver.getTypedText(ethers.utils.toUtf8Bytes(host), ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld), _typed),
      };
    } else if (name && tld) {
      return {
        typed: input.typed,
        text: await contracts.Resolver.getTypedText(ethers.utils.toUtf8Bytes("@"), ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld), _typed),
      };
    }
    return undefined;
  }

  public async getNftRecord(input: IGetNftRecordInput, options?: IOptions): Promise<IGetNftRecordOutput | undefined> {
    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);

    const _chainId = options?.chainId || (await this._getDomainChainId(input.fqdn, options));
    if (!(await this.isExists(input.fqdn, options, _chainId))) throw new DomainNotFoundError(input.fqdn);
    
    const contracts = getContracts(_chainId);

    const { host, name, tld } = extractFqdn(input.fqdn);
    if (host && name && tld) {
      const [contractAddress, tokenId] = await contracts.Resolver.getNFT(
        ethers.utils.toUtf8Bytes(host),
        ethers.utils.toUtf8Bytes(name),
        ethers.utils.toUtf8Bytes(tld),
        input.chainId,
      );
      return {
        chainId: input.chainId,
        contractAddress,
        tokenId: `${tokenId.toNumber()}`,
      };
    } else if (name && tld) {
      const [contractAddress, tokenId] = await contracts.Resolver.getNFT(
        ethers.utils.toUtf8Bytes("@"),
        ethers.utils.toUtf8Bytes(name),
        ethers.utils.toUtf8Bytes(tld),
        input.chainId,
      );
      return {
        chainId: input.chainId,
        contractAddress,
        tokenId: `${tokenId.toNumber()}`,
      };
    }
    return undefined;
  }

  public async isExists(fqdn: string, options?: IOptions, _chainId?: number): Promise<boolean> {
    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);

    // const _chainId = options?.chainId || (await this._getDomainChainId(fqdn, options));
    const contracts = getContracts(_chainId!)

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
