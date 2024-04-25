import { IOptions } from "./IOptions.interface";

export interface IGetDomainOutput {
  fqdn: string | undefined;
  chain: number | undefined;
  owner: string | undefined;
  expiry: luxon.DateTime | undefined;
  resolver: string | undefined | null;
  bridging: boolean | undefined;
  operators: string[] | undefined | null;
  user:
    | {
        address: string;
        expiry: luxon.DateTime;
      }
    | undefined;
  hosts: string[] | undefined;
}

export interface IGetDomainOutputSubgraph {
  host: string[];
  domain: {
    expiry: string;
    operator: {
      address: string;
    } | null;
    owner: {
      address: string;
    } | null;
    user: {
      address: string;
      expiry: string;
    } | null;
    resolver: string | null;
  };
}

export interface IGetHostOutput {
  operators: string[] | undefined;
  user:
    | {
        address: string;
        expiry: luxon.DateTime;
      }
    | undefined;
  records: string[] | undefined;
}

export interface IEdnsRegistryService {
  isExists(fqdn: string, options?: IOptions, _chainId?: number): Promise<boolean>;
  isExpired(fqdn: string, options?: IOptions, _chainId?: number): Promise<boolean>;
  getDomain(fqdn: string, options?: IOptions): Promise<IGetDomainOutput | undefined>;
  getDomainsByAccount(account: string, options?: IOptions): Promise<IGetDomainOutput[] | IGetDomainOutputSubgraph[] | undefined>;
  getHost(fqdn: string, options?: IOptions): Promise<IGetHostOutput | undefined>;
  getTtl(fqdn: string, options?: IOptions): Promise<number | undefined>;
  getOwner(fqdn: string, options?: IOptions): Promise<string | undefined>;
  getExpiry(fqdn: string, options?: IOptions): Promise<number | undefined>;
  // getHostsByDomain(fqdn: string, options?: IOptions): Promise<IGetHostOutput[] | undefined>;
  // getRecordsByHost(fqdn: string, options?: IOptions): Promise<string[] | undefined>;
}
