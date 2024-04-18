import { EdnsV1FromContractService } from "./edns-v1/edns-v1.service";
import { EdnsV2FromContractService, EdnsV2FromRedisService, EdnsV2FromSubgraphService } from "./edns-v2";
import { IOptions } from "../interfaces/IOptions.interface";
import {
  IEdnsResolverService,
  IGetAddressRecordInput,
  IGetAddressRecordOutput,
  IGetAllRecordsInput,
  IGetAllRecordsOutput,
  IGetMultiCoinAddressListOutput,
  IGetMultiCoinAddressRecordInput,
  IGetMultiCoinAddressRecordOutput,
  IGetNftRecordInput,
  IGetNftRecordOutput,
  IGetReverseAddressRecordInput,
  IGetReverseAddressRecordOutput,
  IGetTextRecordInput,
  IGetTextRecordOutput,
  IGetTypedTextListOutput,
  IGetTypedTextRecordInput,
  IGetTypedTextRecordOutput,
  IGetUrlRecordOutput,
} from "../interfaces/IEdnsResolverService.interface";
import { putSqsMessage } from "../utils/put-sqs-message";
import { DomainProvider } from "../constants/domain-provider.constant";
import { EdnsEventType } from "../constants/event-type.constant";
import { extractFqdn } from "../utils/extract-fqdn";
import { Mainnets as EdnsMainnets, Net } from "../network-config";
import { IGetDomainOutput, IGetDomainOutputSubgraph, IGetHostOutput } from "../interfaces/IEdnsRegistryService.interface";
import { DomainNotFoundError } from "../errors/domain-not-found.error";

export class EdnsService implements IEdnsResolverService {
  private readonly _v2RedisService: EdnsV2FromRedisService;
  private readonly _v2ContractService: EdnsV2FromContractService;
  private readonly _v1ContractService: EdnsV1FromContractService;
  private readonly _v2SubgraphService: EdnsV2FromSubgraphService;

  constructor() {
    this._v2RedisService = new EdnsV2FromRedisService();
    this._v2ContractService = new EdnsV2FromContractService();
    this._v1ContractService = new EdnsV1FromContractService();
    this._v2SubgraphService = new EdnsV2FromSubgraphService();
  }

  public async getAllRecords(input: IGetAllRecordsInput, options?: IOptions): Promise<IGetAllRecordsOutput | undefined> {
    if (options?.version === "v1") {
      throw new Error("Not available for v1.");
    }
    if (options?.onchain) {
      throw new Error("Not available on chain.");
    }
    // Get the reverse address from Redis by default
    return await this._v2SubgraphService.getAllRecords(input, options);
  }

  public async getUrlRecord(fqdn: string): Promise<IGetUrlRecordOutput | undefined> {
    // return await this._v2SubgraphService.getUrlRecord(fqdn);
    return undefined;
  }

  public async getReverseAddressRecord(input: IGetReverseAddressRecordInput, options?: IOptions): Promise<IGetReverseAddressRecordOutput | undefined> {
    let output: IGetReverseAddressRecordOutput | undefined;
    let cache: "miss" | "hit" = "miss";
    if (options?.version === "v1") {
      // Return the reverse address from V1 contract if the incoming request specify to V1
      return this._v1ContractService.getReverseAddressRecord(input, options);
    }
    if (!output && options?.onchain) {
      // Return the reverse address from V2 contract if the incoming request specify to V2 and require on chain data
      return this._v2ContractService.getReverseAddressRecord(input, options);
    }
    if (!output && !options?.onchain) {
      // Get the reverse address from Redis by default
      // output = await this._v2RedisService.getReverseAddressRecord(input, options);
      output = await this._v2SubgraphService.getReverseAddressRecord(input, options);
    }
    if (!output) {
      // Get the reverse address from V2 contract if cache from Redis is missing
      output = await this._v2ContractService.getReverseAddressRecord(input, options);
      cache = "miss";
    } else {
      cache = "hit";
    }
    if (output && cache === "miss") {
      // Put a SQS message in the queue to update the reverse address in Redis
      const { host, name, tld } = extractFqdn(output.fqdn);
      // await putSqsMessage({
      //   eventType: EdnsEventType.SET_REVERSE_ADDRESS_RECORD,
      //   provider: DomainProvider.EDNS,
      //   fqdn: output.fqdn,
      //   hash: "FROM_EDGE_API",
      //   data: { host: host || "@", name, tld, address: input.address },
      // });
    }
    return output;
  }

  public async getAddressRecord(input: IGetAddressRecordInput, options?: IOptions): Promise<IGetAddressRecordOutput | undefined> {
    let output: IGetAddressRecordOutput | undefined;
    let cache: "miss" | "hit" = "miss";
    if (options?.version === "v1") {
      return this._v1ContractService.getAddressRecord(input, options);
    }
    if (!output && options?.onchain) {
      return this._v2ContractService.getAddressRecord(input, options);
    }
    if (!output && !options?.onchain) {
      output = await this._v2SubgraphService.getAddressRecord(input, options);
      // output = await this._v2RedisService.getAddressRecord(input, options);
    }
    if (!output) {
      output = await this._v2ContractService.getAddressRecord(input, options);
      // output = await this._v2SubgraphService.getAddressRecord(input, options);
      cache = "miss";
    } else {
      cache = "hit";
    }
    if (output && cache === "miss") {
      const { host, name, tld } = extractFqdn(input.fqdn);
      if (options?.chainId) {
        const isExists = await this._v2ContractService.isExists(input.fqdn, options);
        if (isExists) {
          // await putSqsMessage({
          //   eventType: EdnsEventType.REVALIDATE,
          //   provider: DomainProvider.EDNS,
          //   chainId: options.chainId,
          //   fqdn: input.fqdn,
          //   data: { host: host || "@", name, tld, chainId: options.chainId },
          //   net: EdnsMainnets.includes(options.chainId) ? Net.MAINNET : Net.TESTNET,
          // });
        }
      }
      // await putSqsMessage({
      //   eventType: EdnsEventType.SET_ADDRESS_RECORD,
      //   provider: DomainProvider.EDNS,
      //   fqdn: input.fqdn,
      //   data: { host: host || "@", name, tld, address: output.address },
      //   net: options?.net,
      // });
    }
    return output;
  }

  public async getMultiCoinAddressRecord(input: IGetMultiCoinAddressRecordInput, options?: IOptions): Promise<IGetMultiCoinAddressRecordOutput | undefined> {
    let output: IGetMultiCoinAddressRecordOutput | undefined;
    let cache: "miss" | "hit" = "miss";
    if (options?.version === "v1") {
      return this._v1ContractService.getMultiCoinAddressRecord(input, options);
    }
    if (!output && options?.onchain) {
      // return this._v2SubgraphService.getMultiCoinAddressRecord(input, options);
      return this._v2ContractService.getMultiCoinAddressRecord(input, options);
    }
    if (!output && !options?.onchain) {
      output = await this._v2SubgraphService.getMultiCoinAddressRecord(input, options);
      // output = await this._v2RedisService.getMultiCoinAddressRecord(input, options);
    }
    if (!output) {
      // output = await this._v2SubgraphService.getMultiCoinAddressRecord(input, options);
      output = await this._v2ContractService.getMultiCoinAddressRecord(input, options);
      cache = "miss";
    } else {
      cache = "hit";
    }
    if (output && cache === "miss") {
      const { host, name, tld } = extractFqdn(input.fqdn);
      if (options?.chainId) {
        const isExists = await this._v2ContractService.isExists(input.fqdn, options);
        if (isExists) {
          // await putSqsMessage({
          //   eventType: EdnsEventType.REVALIDATE,
          //   provider: DomainProvider.EDNS,
          //   chainId: options.chainId,
          //   fqdn: input.fqdn,
          //   data: { host: host || "@", name, tld, chainId: options.chainId },
          //   net: EdnsMainnets.includes(options.chainId) ? Net.MAINNET : Net.TESTNET,
          // });
        }
      }
      // await putSqsMessage({
      //   eventType: EdnsEventType.SET_MULTI_COIN_ADDRESS_RECORD,
      //   provider: DomainProvider.EDNS,
      //   fqdn: input.fqdn,
      //   hash: "FROM_EDGE_API",
      //   data: {
      //     host: host || "@",
      //     name,
      //     tld,
      //     address: output.address,
      //     coin: output.coin,
      //   },
      //   net: options?.net,
      // });
    }
    return output;
  }

  public async getTextRecord(input: IGetTextRecordInput, options?: IOptions): Promise<IGetTextRecordOutput | undefined> {
    let output: IGetTextRecordOutput | undefined;
    let cache: "miss" | "hit" = "miss";
    if (options?.version === "v1") {
      return this._v1ContractService.getTextRecord(input, options);
    }
    if (!output && options?.onchain) {
      // return this._v2SubgraphService.getTextRecord(input, options);
      return this._v2ContractService.getTextRecord(input, options);
    }
    if (!output && !options?.onchain) {
      output = await this._v2SubgraphService.getTextRecord(input, options);
      // output = await this._v2RedisService.getTextRecord(input, options);
    }
    if (!output) {
      output = await this._v2ContractService.getTextRecord(input, options);
      // output = await this._v2SubgraphService.getTextRecord(input, options);
      cache = "miss";
    } else {
      cache = "hit";
    }
    if (output && cache === "miss") {
      const { host, name, tld } = extractFqdn(input.fqdn);
      if (options?.chainId) {
        const isExists = await this._v2ContractService.isExists(input.fqdn, options);
        if (isExists) {
          // await putSqsMessage({
          //   eventType: EdnsEventType.REVALIDATE,
          //   provider: DomainProvider.EDNS,
          //   chainId: options.chainId,
          //   fqdn: input.fqdn,
          //   data: { host: host || "@", name, tld, chainId: options.chainId },
          //   net: EdnsMainnets.includes(options.chainId) ? Net.MAINNET : Net.TESTNET,
          // });
        }
      }
      // await putSqsMessage({
      //   eventType: EdnsEventType.SET_TEXT_RECORD,
      //   provider: DomainProvider.EDNS,
      //   fqdn: input.fqdn,
      //   hash: "FROM_EDGE_API",
      //   data: { host: host || "@", name, tld, text: output.text },
      //   net: options?.net,
      // });
    }
    return output;
  }

  public async getTypedTextRecord(input: IGetTypedTextRecordInput, options?: IOptions): Promise<IGetTypedTextRecordOutput | undefined> {
    if (options?.version === "v1") {
      return this._v1ContractService.getTypedTextRecord(input, options);
    }
    if (options?.onchain) {
      return this._v2ContractService.getTypedTextRecord(input, options);
    } else {
      return this._v2SubgraphService.getTypedTextRecord(input, options);
    }
  }

  public async getNftRecord(input: IGetNftRecordInput, options?: IOptions): Promise<IGetNftRecordOutput | undefined> {
    let output: IGetNftRecordOutput | undefined;
    let cache: "miss" | "hit" = "miss";
    if (options?.version === "v1") {
      return this._v1ContractService.getNftRecord(input, options);
    }
    if (!output && options?.onchain) {
      return this._v2ContractService.getNftRecord(input, options);
      // return this._v2SubgraphService.getNftRecord(input, options);
    }
    if (!output && !options?.onchain) {
      // output = await this._v2RedisService.getNftRecord(input, options);
      output = await this._v2SubgraphService.getNftRecord(input, options);
    }
    if (!output) {
      output = await this._v2ContractService.getNftRecord(input, options);
      // output = await this._v2SubgraphService.getNftRecord(input, options);
      cache = "miss";
    } else {
      cache = "hit";
    }
    if (output && cache === "miss") {
      const { host, name, tld } = extractFqdn(input.fqdn);
      if (options?.chainId) {
        const isExists = await this._v2ContractService.isExists(input.fqdn, options);
        if (isExists) {
          // await putSqsMessage({
          //   eventType: EdnsEventType.REVALIDATE,
          //   provider: DomainProvider.EDNS,
          //   chainId: options.chainId,
          //   fqdn: input.fqdn,
          //   data: { host: host || "@", name, tld, chainId: options.chainId },
          //   net: EdnsMainnets.includes(options.chainId) ? Net.MAINNET : Net.TESTNET,
          // });
        }
      }
      // await putSqsMessage({
      //   eventType: EdnsEventType.SET_NFT_RECORD,
      //   provider: DomainProvider.EDNS,
      //   fqdn: input.fqdn,
      //   hash: "FROM_EDGE_API",
      //   data: {
      //     host: host || "@",
      //     name,
      //     tld,
      //     chainId: output.chainId,
      //     contractAddress: output.contractAddress,
      //     tokenId: output.tokenId,
      //   },
      //   net: options?.net,
      // });
    }
    return output;
  }

  public async getDomain(fqdn: string, options?: IOptions): Promise<IGetDomainOutput | undefined> {
    let output: IGetDomainOutput | undefined;
    if (options?.version === "v1") {
      throw new Error("Not available for v1.");
    }
    if (!output && options?.onchain) {
      throw new Error("Not available on chain.");
    }
    if (!output && !options?.onchain) {
      // output = await this._v2RedisService.getDomain(fqdn, options);
      output = await this._v2SubgraphService.getDomain(fqdn, options);
      if (!output) throw new DomainNotFoundError(fqdn);
    }
    return output;
  }

  public async getOwner(fqdn: string, options?: IOptions): Promise<string | undefined> {
    let output: string | undefined;
    if (options?.version === "v1") {
      throw new Error("Not implemented for v1");
    }
    if (!output && options?.onchain) {
      return this._v2ContractService.getOwner(fqdn, options);
    }
    if (!output && !options?.onchain) {
      output = await this._v2SubgraphService.getOwner(fqdn, options);
    }
    return output;
  }

  public async getExpiry(fqdn: string, options?: IOptions): Promise<number | undefined> {
    let output: number | undefined;
    if (options?.version === "v1") {
      throw new Error("Not implemented for v1");
    }
    if (!output && options?.onchain) {
      return this._v2ContractService.getExpiry(fqdn, options);
    }
    if (!output && !options?.onchain) {
      output = await this._v2SubgraphService.getExpiry(fqdn, options);
    }
    if (!output) {
      output = await this._v2ContractService.getExpiry(fqdn, options);
    }
    return output;
  }

  public async getDomainsByAccount(account: string, options?: IOptions): Promise<IGetDomainOutput[] | IGetDomainOutputSubgraph[] | undefined> {
    let output: IGetDomainOutput[] | IGetDomainOutputSubgraph[] | undefined = [];
    if (options?.version === "v1") {
      throw new Error("Not implemented for v1");
    }
    if (output.length === 0 && options?.onchain) {
      throw new Error("Not available on chain.");
    }
    if (output.length === 0 && !options?.onchain) {
      output = await this._v2SubgraphService.getDomainsByAccount(account, options);
    }
    return output;
  }

  public async getHost(fqdn: string, options?: IOptions): Promise<IGetHostOutput | undefined> {
    let output: IGetHostOutput | undefined;
    if (options?.version === "v1") {
      throw new Error("Not implemented for v1");
    }
    if (!output && options?.onchain) {
      throw new Error("Not available on chain.");
    }
    if (!output && !options?.onchain) {
      output = await this._v2SubgraphService.getHost(fqdn, options);
    }
    return output;
  }

  public async getTtl(fqdn: string, options?: IOptions): Promise<number | undefined> {
    if (options?.version === "v1") {
      return 3600;
    }
    if (options?.onchain) {
      return this._v2ContractService.getTtl(fqdn, options);
    } else {
      return this._v2SubgraphService.getTtl(fqdn, options);
    }
  }

  // public async getBridgeEvents(input: IGetBridgedEventInput, options?: IOptions): Promise<string | undefined> {
  //   const output = await this._v2RedisService.getBridgedEvent(input, options);
  //   return output;
  // }

  public async getMultiCoinAddressList(fqdn: string, options?: IOptions): Promise<IGetMultiCoinAddressListOutput | undefined> {
    let output: IGetMultiCoinAddressListOutput | undefined;
    if (options?.version === "v1") {
      throw new Error("Not implemented for v1");
    }
    if (!output && options?.onchain) {
      throw new Error("Not available on chain.");
    }
    if (!output && !options?.onchain) {
      // output = await this._v2SubgraphService.getMultiCoinAddressList(fqdn, options);
      return undefined;
    }
    return output;
  }

  public async getTypedTextList(fqdn: string, options?: IOptions): Promise<IGetTypedTextListOutput | undefined> {
    let output: IGetTypedTextListOutput | undefined;
    if (options?.version === "v1") {
      throw new Error("Not implemented for v1");
    }

    if (!output && options?.onchain) {
      throw new Error("Not available on chain.");
    }
    if (!output && !options?.onchain) {
      // output = await this._v2SubgraphService.getTypedTextList(fqdn, options);
      return undefined;
    }
    return output;
  }
  public async getUrlByPodName(podName: string, options?: IOptions) {
    let output: string | undefined;
    let cache: "miss" | "hit" = "miss";
    if (options?.version === "v1") {
      throw new Error("Not implemented for v1");
    }
    if (!output && options?.onchain) {
      return this._v2ContractService.getUrlByPodName(podName, options);
      // return this._v2SubgraphService.getUrlByPodName(podName, options);
    }
    if (!output && !options?.onchain) {
      output = await this._v2SubgraphService.getUrlByPodName(podName, options);
      // output = await this._v2RedisService.getUrlByPodName(podName);
    }
    if (!output) {
      output = await this._v2ContractService.getUrlByPodName(podName, options);
      cache = "miss";
    } else {
      cache = "hit";
    }
    // const url = await this._v2RedisService.getUrlByPodName(podName);
    return output;
  }

  public async revalidate(fqdn: string): Promise<void> {
    const { host, name, tld } = extractFqdn(fqdn);
  }
}
