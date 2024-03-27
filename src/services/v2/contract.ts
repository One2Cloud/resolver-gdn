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
import { EdnsV2FromRedisService, getContracts } from ".";

export class EdnsV2FromContractService implements IEdnsResolverService, IEdnsRegistryService {
  private async _getDomainChainId(domain: string, options?: IOptions): Promise<number> {
    const redis = createRedisClient();
    const { host, name, tld } = extractFqdn(domain);
    const inContractChain = await redis.hget(Key.DOMAIN_INFO_$HASH(options?.net || Net.MAINNET, `${name}.${tld}`), "chain");
    if (!inContractChain) throw new CantGetChainIdError(domain);
    return await getChainId(options?.net || Net.MAINNET, parseInt(inContractChain));
  }

  public async getUrlByPodName(podName: string, options?: IOptions): Promise<string> {
    const redis = await createRedisClient();
    const net = options?.net || Net.MAINNET;
    const url = await redis.hget(Key.DEDRIVE_DNS_$SET(net, podName), "url");
    if (!url) {
      throw new Error(" Url Record Not Found ");
    }
    return url;
  }
  public async getAllRecords(input: IGetAllRecordsInput, options?: IOptions | undefined): Promise<IGetAllRecordsOutput | undefined> {
    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);
    const _chainId = options?.chainId || (await this._getDomainChainId(input.fqdn, options));
    if (!(await this.isExists(input.fqdn, options, _chainId))) throw new DomainNotFoundError(input.fqdn);
    if (await this.isExpired(input.fqdn, options, _chainId)) throw new DomainExpiredError(input.fqdn);
    const contracts = getContracts(_chainId);

    const { host = "@", name, tld } = extractFqdn(input.fqdn);
    if (!name) throw new CantGetDomainNameError(input.fqdn);
    const ethHostByte = ethers.utils.toUtf8Bytes(host);
    const ethNameByte = ethers.utils.toUtf8Bytes(name);
    const ethTldByte = ethers.utils.toUtf8Bytes(tld);

    const address: string = await contracts.Resolver.getAddress(ethHostByte, ethNameByte, ethTldByte);
    const text: string = await contracts.Resolver.getText(ethHostByte, ethNameByte, ethTldByte);

    throw new Error("Method not implemented.");
  }

  public async getReverseAddressRecord(input: IGetReverseAddressRecordInput, options?: IOptions): Promise<IGetReverseAddressRecordOutput | undefined> {
    if (!options?.chainId) throw new MissingChainIdError();
    try {
      const contracts = getContracts(options.chainId);
      const fqdn = await contracts.Resolver.getReverseAddress(input.address);
      if (fqdn) return { fqdn };
      return undefined;
    } catch (error) {
      console.log(error);
    }
  }

  public async getAddressRecord(input: IGetAddressRecordInput, options?: IOptions): Promise<IGetAddressRecordOutput | undefined> {
    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);
    const _chainId = options?.chainId || (await this._getDomainChainId(input.fqdn, options));
    if (!(await this.isExists(input.fqdn, options, _chainId))) throw new DomainNotFoundError(input.fqdn);
    if (await this.isExpired(input.fqdn, options, _chainId)) throw new DomainExpiredError(input.fqdn);
    const contracts = getContracts(_chainId);

    const { host = "@", name, tld } = extractFqdn(input.fqdn);

    let result: IGetAddressRecordOutput | undefined = undefined;
    if (host && name && tld) {
      result = {
        address: await contracts.Resolver.getAddress(ethers.utils.toUtf8Bytes(host), ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld)),
      };
    }

    return result;
  }

  public async getMultiCoinAddressRecord(input: IGetMultiCoinAddressRecordInput, options?: IOptions): Promise<IGetMultiCoinAddressRecordOutput | undefined> {
    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);

    const _chainId = options?.chainId || (await this._getDomainChainId(input.fqdn, options));
    if (!(await this.isExists(input.fqdn, options, _chainId))) throw new DomainNotFoundError(input.fqdn);
    if (await this.isExpired(input.fqdn, options, _chainId)) throw new DomainExpiredError(input.fqdn);

    const contracts = getContracts(_chainId);

    const { host = "@", name, tld } = extractFqdn(input.fqdn);
    let result: IGetMultiCoinAddressRecordOutput | undefined = undefined;
    if (host && name && tld) {
      result = {
        coin: input.coin,
        address: await contracts.Resolver.getMultiCoinAddress(
          ethers.utils.toUtf8Bytes(host),
          ethers.utils.toUtf8Bytes(name),
          ethers.utils.toUtf8Bytes(tld),
          BigNumber.from(input.coin),
        ),
      };
    }
    if (!result || result.address === "0x") {
      return undefined;
    } else {
      return result;
    }
  }

  public async getTextRecord(input: IGetTextRecordInput, options?: IOptions): Promise<IGetTextRecordOutput | undefined> {
    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);
    const _chainId = options?.chainId || (await this._getDomainChainId(input.fqdn, options));
    if (!(await this.isExists(input.fqdn, options, _chainId))) throw new DomainNotFoundError(input.fqdn);
    if (await this.isExpired(input.fqdn, options, _chainId)) throw new DomainExpiredError(input.fqdn);
    const contracts = getContracts(_chainId);
    let result: IGetTextRecordOutput | undefined = undefined;
    const { host = "@", name, tld } = extractFqdn(input.fqdn);
    if (host && name && tld) {
      result = {
        text: await contracts.Resolver.getText(ethers.utils.toUtf8Bytes(host), ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld)),
      };
    }
    if (!result || result.text === "") {
      return undefined;
    } else {
      return result;
    }
  }

  public async getTypedTextRecord(input: IGetTypedTextRecordInput, options?: IOptions): Promise<IGetTypedTextRecordOutput | undefined> {
    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);

    const _chainId = options?.chainId || (await this._getDomainChainId(input.fqdn, options));
    if (!(await this.isExists(input.fqdn, options, _chainId))) throw new DomainNotFoundError(input.fqdn);
    if (await this.isExpired(input.fqdn, options, _chainId)) throw new DomainExpiredError(input.fqdn);

    const contracts = getContracts(_chainId);

    const _typed = ethers.utils.toUtf8Bytes(input.typed);

    const { host = "@", name, tld } = extractFqdn(input.fqdn);
    let result;
    if (host && name && tld) {
      result = {
        typed: input.typed,
        text: await contracts.Resolver.getTypedText(ethers.utils.toUtf8Bytes(host), ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld), _typed),
      };
    }
    if (!result || result.text === "") {
      return undefined;
    } else {
      return result;
    }
  }

  public async getNftRecord(input: IGetNftRecordInput, options?: IOptions): Promise<IGetNftRecordOutput | undefined> {
    if (!isValidFqdn(input.fqdn)) throw new InvalidFqdnError(input.fqdn);
    const _chainId = options?.chainId || (await this._getDomainChainId(input.fqdn, options));
    if (!(await this.isExists(input.fqdn, options, _chainId))) throw new DomainNotFoundError(input.fqdn);
    if (await this.isExpired(input.fqdn, options, _chainId)) throw new DomainExpiredError(input.fqdn);

    const contracts = getContracts(_chainId);

    const { host = "@", name, tld } = extractFqdn(input.fqdn);
    let result;
    if (host && name && tld) {
      const [contractAddress, tokenId] = await contracts.Resolver.getNFT(
        ethers.utils.toUtf8Bytes(host),
        ethers.utils.toUtf8Bytes(name),
        ethers.utils.toUtf8Bytes(tld),
        input.chainId,
      );
      result = {
        chainId: input.chainId,
        contractAddress,
        tokenId: `${tokenId.toNumber()}`,
      };
    }
    if (!result || result.contractAddress === "0x0000000000000000000000000000000000000000") {
      return undefined;
    } else {
      return result;
    }
  }

  public async isExists(fqdn: string, options?: IOptions, _chainId?: number): Promise<boolean> {
    const chainId = options?.chainId || _chainId;
    if (!chainId) throw new Error("chainIdis missing");

    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);

    const contracts = getContracts(chainId);

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

  public async isExpired(fqdn: string, options?: IOptions, _chainId?: number): Promise<boolean> {
    const chainId = options?.chainId || _chainId;
    if (!chainId) throw new Error("chainIdis missing");

    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);

    const contracts = getContracts(_chainId!);

    let time;
    const { host, name, tld } = extractFqdn(fqdn);
    if (name && tld) {
      time = await contracts.Registry["getExpiry(bytes32,bytes32)"](ethers.utils.solidityKeccak256(["string"], [name]), ethers.utils.solidityKeccak256(["string"], [tld]));
    } else {
      time = await contracts.Registry["getExpiry(bytes32)"](ethers.utils.keccak256(tld));
    }
    return timeIsPassed(time.toNumber());
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

  public async getTtl(fqdn: string, options?: IOptions): Promise<number | undefined> {
    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);
    const _chainId = options?.chainId || (await this._getDomainChainId(fqdn, options));
    if (!(await this.isExists(fqdn, options, _chainId))) throw new DomainNotFoundError(fqdn);
    if (await this.isExpired(fqdn, options, _chainId)) throw new DomainExpiredError(fqdn);
    const contracts = getContracts(_chainId);
    const { host, name, tld } = extractFqdn(fqdn);
    if (host && name && tld) {
      const ttl = await contracts.Registry.getTtl(
        ethers.utils.solidityKeccak256(["string"], [host]),
        ethers.utils.solidityKeccak256(["string"], [name]),
        ethers.utils.solidityKeccak256(["string"], [tld]),
      );
      return ttl;
    }
    return undefined;
  }

  public async getOwner(fqdn: string, options?: IOptions): Promise<string | undefined> {
    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);
    const _chainId = options?.chainId || (await this._getDomainChainId(fqdn, options));
    if (!(await this.isExists(fqdn, options, _chainId))) throw new DomainNotFoundError(fqdn);
    if (await this.isExpired(fqdn, options, _chainId)) throw new DomainExpiredError(fqdn);
    const contracts = getContracts(_chainId);
    const { host, name, tld } = extractFqdn(fqdn);
    if (name && tld) {
      const owner = await contracts.Registry["getOwner(bytes32,bytes32)"](ethers.utils.solidityKeccak256(["string"], [name]), ethers.utils.solidityKeccak256(["string"], [tld]));
      return owner;
    }
    return undefined;
  }

  public async getExpiry(fqdn: string, options?: IOptions): Promise<number | undefined> {
    if (!isValidFqdn(fqdn)) throw new InvalidFqdnError(fqdn);
    const _chainId = options?.chainId || (await this._getDomainChainId(fqdn, options));
    if (!(await this.isExists(fqdn, options, _chainId))) throw new DomainNotFoundError(fqdn);
    if (await this.isExpired(fqdn, options, _chainId)) throw new DomainExpiredError(fqdn);
    const contracts = getContracts(_chainId);
    const { host, name, tld } = extractFqdn(fqdn);
    if (name && tld) {
      const expiry = await contracts.Registry["getExpiry(bytes32,bytes32)"](ethers.utils.solidityKeccak256(["string"], [name]), ethers.utils.solidityKeccak256(["string"], [tld]));
      return expiry.toNumber();
    }
    return undefined;
  }
}
