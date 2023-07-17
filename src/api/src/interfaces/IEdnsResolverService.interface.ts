import { IOptions } from "./IOptions.interface";

export interface IGenericInput {
  fqdn: string;
}

export interface IGetReverseAddressRecordInput {
  address: string;
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
  text: string;
}

export interface IGetTypedTextRecordInput extends IGenericInput {
  typed: string;
}
export interface IGetTypedTextRecordOutput {
  typed: string;
  text: string;
}

export interface IGetNftRecordInput extends IGenericInput {
  chainId: string;
}

export interface IGetNftRecordOutput {
  chainId: string;
  contractAddress: string;
  tokenId: string;
}

export interface IEdnsResolverService {
  getReverseAddressRecord(input: IGetReverseAddressRecordInput, options?: IOptions): Promise<IGetReverseAddressRecordOutput | undefined>;
  getAddressRecord(input: IGetAddressRecordInput, options?: IOptions): Promise<IGetAddressRecordOutput | undefined>;
  getMultiCoinAddressRecord(input: IGetMultiCoinAddressRecordInput, options?: IOptions): Promise<IGetMultiCoinAddressRecordOutput | undefined>;
  getTextRecord(input: IGetTextRecordInput, options?: IOptions): Promise<IGetTextRecordOutput | undefined>;
  getTypedTextRecord(input: IGetTypedTextRecordInput, options?: IOptions): Promise<IGetTypedTextRecordOutput | undefined>;
  getNftRecord(input: IGetNftRecordInput, options?: IOptions): Promise<IGetNftRecordOutput | undefined>;
  // getAllRecords(fqdn: string): Promise<IGetAddressRecordOutput[] | undefined>;
}
