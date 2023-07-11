import { IOptions } from "./IOptions.interface";

export interface IGetAddressRecordOutput {
  address: string;
}
export interface IGetMultiCoinAddressRecordOutput {
  coin: string;
  address: string;
}
export interface IGetTextRecordOutput {
  text: string;
}
export interface IGetTypedTextRecordOutput {
  typed: string;
  text: string;
}

export interface IGetNftRecordOutput {
  chainId: string;
  contractAddress: string;
  tokenId: string;
}

export interface IGetDomainOutput {
  chain: number;
  owner: string;
  expiry: luxon.DateTime;
  resolver: string;
  operators: string[];
  user: {
    address: string;
    expiry: luxon.DateTime;
  };
  hosts: string[];
}

export interface IGetHostOutput {
  operators: string[];
  user: {
    address: string;
    expiry: luxon.DateTime;
  };
  records: string[];
}

export interface IEdnsResolverServiceV1 {
  getAddressRecord(fqdn: string, coinName: string): Promise<IGetAddressRecordOutput | undefined>;
  getMultiCoinAddressRecord(fqdn: string, coin: string, options?: IOptions): Promise<IGetMultiCoinAddressRecordOutput | undefined>;
  getTextRecord(fqdn: string, options?: IOptions): Promise<IGetTextRecordOutput | undefined>;
  getTypedTextRecord(fqdn: string, typed: string, options?: IOptions): Promise<IGetTypedTextRecordOutput | undefined>;
  getNftRecord(fqdn: string, chainId: string, options?: IOptions): Promise<IGetNftRecordOutput | undefined>;
  // getAllRecords(fqdn: string): Promise<IGetAddressRecordOutput[] | undefined>;
}

export interface IEdnsResolverServiceV2 {
  getAddressRecord(fqdn: string, options?: IOptions): Promise<IGetAddressRecordOutput | undefined>;
  getMultiCoinAddressRecord(fqdn: string, coin: string, options?: IOptions): Promise<IGetMultiCoinAddressRecordOutput | undefined>;
  getTextRecord(fqdn: string, options?: IOptions): Promise<IGetTextRecordOutput | undefined>;
  getTypedTextRecord(fqdn: string, typed: string, options?: IOptions): Promise<IGetTypedTextRecordOutput | undefined>;
  getNftRecord(fqdn: string, chainId: string, options?: IOptions): Promise<IGetNftRecordOutput | undefined>;
  // getAllRecords(fqdn: string): Promise<IGetAddressRecordOutput[] | undefined>;
}