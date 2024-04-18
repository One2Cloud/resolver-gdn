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
    return this._v2SubgraphService.getAllRecords(input, options);
  }

  public async getUrlRecord(fqdn: string): Promise<IGetUrlRecordOutput | undefined> {
    // return await this._v2SubgraphService.getUrlRecord(fqdn);
    return undefined;
  }

  public async getReverseAddressRecord(input: IGetReverseAddressRecordInput, options?: IOptions): Promise<IGetReverseAddressRecordOutput | undefined> {
    if (options?.version === "v1") {
      return this._v1ContractService.getReverseAddressRecord(input, options);
    }
    if (options?.onchain) {
      return this._v2ContractService.getReverseAddressRecord(input, options);
    } else {
      return this._v2SubgraphService.getReverseAddressRecord(input, options);
    }
  }

  public async getAddressRecord(input: IGetAddressRecordInput, options?: IOptions): Promise<IGetAddressRecordOutput | undefined> {
    if (options?.version === "v1") {
      return this._v1ContractService.getAddressRecord(input, options);
    }
    if (options?.onchain) {
      return this._v2ContractService.getAddressRecord(input, options);
    } else {
      return this._v2SubgraphService.getAddressRecord(input, options);
    }
  }

  public async getMultiCoinAddressRecord(input: IGetMultiCoinAddressRecordInput, options?: IOptions): Promise<IGetMultiCoinAddressRecordOutput | undefined> {
    if (options?.version === "v1") {
      return this._v1ContractService.getMultiCoinAddressRecord(input, options);
    }
    if (options?.onchain) {
      return this._v2ContractService.getMultiCoinAddressRecord(input, options);
    } else {
      return this._v2SubgraphService.getMultiCoinAddressRecord(input, options);
    }
  }

  public async getTextRecord(input: IGetTextRecordInput, options?: IOptions): Promise<IGetTextRecordOutput | undefined> {
    if (options?.version === "v1") {
      return this._v1ContractService.getTextRecord(input, options);
    }
    if (options?.onchain) {
      return this._v2ContractService.getTextRecord(input, options);
    } else {
      return this._v2SubgraphService.getTextRecord(input, options);
    }
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
    if (options?.version === "v1") {
      return this._v1ContractService.getNftRecord(input, options);
    }
    if (options?.onchain) {
      return this._v2ContractService.getNftRecord(input, options);
    } else {
      return this._v2SubgraphService.getNftRecord(input, options);
    }
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
    if (options?.version === "v1") {
      throw new Error("Not implemented for v1");
    }
    if (!options?.onchain) {
      return this._v2ContractService.getUrlByPodName(podName, options);
    } else {
      return this._v2SubgraphService.getUrlByPodName(podName, options);
    }
  }
}
