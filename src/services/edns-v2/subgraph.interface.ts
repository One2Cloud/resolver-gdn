import * as luxon from 'luxon'
export enum IDomainType {
  UNIVERSAL = "universal",
  CLASSICAL = "classical",
  OMNI = "omni",
}

export interface IGetWalletInfoOutput {
  address: string;
  resversedDomain: string | null;
  domains: IWalletDomainDetailsOutput | IWalletDomainDetailsOutput[];
}

export interface IWalletDomainDetailsOutput {
  fqdn: string;
  chainId: number;
  type: IDomainType;
  tokenId: string;
  expiry: luxon.DateTime;
}

export interface IDomainDetailsOutput {
  chainId: number;
  type: IDomainType;
  owner: string; //Address
  tokenId: string;
  expiry: luxon.DateTime;
  records: {
    text: string;
    address: string;
    typedText: {
      [key: string]: string;
    };
    typedAddress: {
      [key: string]: string;
    };
  };
}
