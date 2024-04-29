import { IOptions } from "./IOptions.interface";

export interface IGenericInput {
  fqdn: string;
}

export interface IGetAllRecordsInput extends IGenericInput {}

export interface IGetAllRecordsOutput {
  fqdn: string;
  address?: string;
  text?: string;
  typedTexts?: { [key: string]: string };
  typedAddresses?: { [key: string]: string };
}

export interface IGetUrlRecordOutput {
  text: string | undefined;
}

export interface IGetReverseAddressRecordInput {
  address: string;
}

export interface IGetBridgedEventInput extends IGenericInput {
  fqdn: string;
  chainId: string;
}

export interface IGetReverseAddressRecordOutput {
  fqdn: string;
}

export interface IGetAddressRecordInput extends IGenericInput {}

export interface IGetAddressRecordOutput {
  address: string;
}

export interface IGetMultiCoinAddressRecordInput extends IGenericInput {
  coin: string;
}
export interface IGetMultiCoinAddressRecordOutput {
  coin: string;
  address: string;
}

export interface IGetTextRecordInput extends IGenericInput {}
export interface IGetTextRecordOutput {
  text: string | undefined;
}

export interface IGetTypedTextRecordInput extends IGenericInput {
  typed: string;
}
export interface IGetTypedTextRecordOutput {
  typed: string;
  text: string | undefined;
}

export interface IGetNftRecordInput extends IGenericInput {
  chainId: string;
}

export interface IGetNftRecordOutput {
  chainId: string;
  contractAddress: string;
  tokenId: string;
}

export interface IGetMultiCoinAddressListOutput {
  records_list: string[] | undefined;
}

export interface IGetTypedTextListOutput {
  records_list: string[] | undefined;
}

export interface IEdnsResolverService {
  getAllRecords(input: IGetAllRecordsInput, options?: IOptions): Promise<IGetAllRecordsOutput | undefined>;
  getReverseAddressRecord(input: IGetReverseAddressRecordInput, options?: IOptions): Promise<IGetReverseAddressRecordOutput | undefined>;
  getAddressRecord(input: IGetAddressRecordInput, options?: IOptions): Promise<IGetAddressRecordOutput | undefined>;
  getMultiCoinAddressRecord(input: IGetMultiCoinAddressRecordInput, options?: IOptions): Promise<IGetMultiCoinAddressRecordOutput | undefined>;
  getTextRecord(input: IGetTextRecordInput, options?: IOptions): Promise<IGetTextRecordOutput | undefined>;
  getTypedTextRecord(input: IGetTypedTextRecordInput, options?: IOptions): Promise<IGetTypedTextRecordOutput | undefined>;
  getNftRecord(input: IGetNftRecordInput, options?: IOptions): Promise<IGetNftRecordOutput | undefined>;
  // getAllRecords(fqdn: string): Promise<IGetAddressRecordOutput[] | undefined>;
  getUrlByPodName(podName: string, options?: IOptions): Promise<string[] | undefined>;
}
