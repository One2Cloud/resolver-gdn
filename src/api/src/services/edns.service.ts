import { EdnsV1FromContractService } from "./edns-v1.service";
import { EdnsV2FromContractService, EdnsV2FromRedisService } from "./edns-v2.service";
import { IOptions } from "../interfaces/IOptions.interface";
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

export class EdnsService implements IEdnsResolverService {
  private readonly _v2RedisService: EdnsV2FromRedisService;
  private readonly _v2ContractService: EdnsV2FromContractService;
  private readonly _v1ContractService: EdnsV1FromContractService;

  constructor() {
    this._v2RedisService = new EdnsV2FromRedisService();
    this._v2ContractService = new EdnsV2FromContractService();
    this._v1ContractService = new EdnsV1FromContractService();
  }

  public async getReverseAddressRecord(input: IGetReverseAddressRecordInput, options?: IOptions): Promise<IGetReverseAddressRecordOutput | undefined> {
    let output: IGetReverseAddressRecordOutput | undefined;
    if (options?.version === "v1") return this._v1ContractService.getReverseAddressRecord(input, options);
    if (!output && options?.onchain) output = await this._v2ContractService.getReverseAddressRecord(input, options);
    if (!output && !options?.onchain) output = await this._v2RedisService.getReverseAddressRecord(input, options);
    if (!output) output = await this._v2ContractService.getReverseAddressRecord(input, options);
    return output;
  }

  public async getAddressRecord(input: IGetAddressRecordInput, options?: IOptions): Promise<IGetAddressRecordOutput | undefined> {
    let output: IGetAddressRecordOutput | undefined;
    if (options?.version === "v1") return this._v1ContractService.getAddressRecord(input, options);
    if (!output && options?.onchain) output = await this._v2ContractService.getAddressRecord(input, options);
    if (!output && !options?.onchain) output = await this._v2RedisService.getAddressRecord(input, options);
    if (!output) output = await this._v2ContractService.getAddressRecord(input, options);
    return output;
  }

  public async getMultiCoinAddressRecord(input: IGetMultiCoinAddressRecordInput, options?: IOptions): Promise<IGetMultiCoinAddressRecordOutput | undefined> {
    let output: IGetMultiCoinAddressRecordOutput | undefined;
    if (options?.version === "v1") return this._v1ContractService.getMultiCoinAddressRecord(input, options);
    if (!output && options?.onchain) output = await this._v2ContractService.getMultiCoinAddressRecord(input, options);
    if (!output && !options?.onchain) output = await this._v2RedisService.getMultiCoinAddressRecord(input, options);
    if (!output) output = await this._v2ContractService.getMultiCoinAddressRecord(input, options);
    return output;
  }

  public async getTextRecord(input: IGetTextRecordInput, options?: IOptions): Promise<IGetTextRecordOutput | undefined> {
    let output: IGetTextRecordOutput | undefined;
    if (options?.version === "v1") return this._v1ContractService.getTextRecord(input, options);
    if (!output && options?.onchain) output = await this._v2ContractService.getTextRecord(input, options);
    if (!output && !options?.onchain) output = await this._v2RedisService.getTextRecord(input, options);
    if (!output) output = await this._v2ContractService.getTextRecord(input, options);
    return output;
  }

  public async getTypedTextRecord(input: IGetTypedTextRecordInput, options?: IOptions): Promise<IGetTypedTextRecordOutput | undefined> {
    let output: IGetTypedTextRecordOutput | undefined;
    if (options?.version === "v1") return this._v1ContractService.getTypedTextRecord(input, options);
    if (!output && options?.onchain) output = await this._v2ContractService.getTypedTextRecord(input, options);
    if (!output && !options?.onchain) output = await this._v2RedisService.getTypedTextRecord(input, options);
    if (!output) output = await this._v2ContractService.getTypedTextRecord(input, options);
    return output;
  }

  public async getNftRecord(input: IGetNftRecordInput, options?: IOptions): Promise<IGetNftRecordOutput | undefined> {
    let output: IGetNftRecordOutput | undefined;
    if (options?.version === "v1") return this._v1ContractService.getNftRecord(input, options);
    if (!output && options?.onchain) output = await this._v2ContractService.getNftRecord(input, options);
    if (!output && !options?.onchain) output = await this._v2RedisService.getNftRecord(input, options);
    if (!output) output = await this._v2ContractService.getNftRecord(input, options);
    return output;
  }
}
