import { IOptions } from "./IOptions.interface";

export interface IGetDomainOutput {
  chain: number;
  owner: string;
  expiry: luxon.DateTime;
  resolver: string;
  bridging: boolean;
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

export interface IEdnsRegistryService{
  isExists(fqdn: string, options?: IOptions): Promise<boolean>;
  getDomain(fqdn: string, options?: IOptions): Promise<IGetDomainOutput | undefined>;
  getDomainsByAccount(account: string, options?: IOptions): Promise<IGetDomainOutput[] | undefined>;
  getHost(fqdn: string, options?: IOptions): Promise<IGetHostOutput | undefined>;
  // getHostsByDomain(fqdn: string, options?: IOptions): Promise<IGetHostOutput[] | undefined>;
  // getRecordsByHost(fqdn: string, options?: IOptions): Promise<string[] | undefined>;
}