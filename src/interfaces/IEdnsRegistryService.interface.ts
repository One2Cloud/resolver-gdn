import { IOptions } from "./IOptions.interface";

export interface IGetDomainOutput {
	chain: number | undefined;
	owner: string | undefined;
	expiry: luxon.DateTime | undefined;
	resolver: string | undefined;
	bridging: boolean | undefined;
	operators: string[] | undefined;
	user: {
		address: string;
		expiry: luxon.DateTime;
	} | undefined;
	hosts: string[] | undefined;
}

export interface IGetHostOutput {
	operators: string[] | undefined;
	user: {
		address: string;
		expiry: luxon.DateTime;
	} | undefined;
    records: string[] | undefined;
}

export interface IEdnsRegistryService {
	isExists(fqdn: string, options?: IOptions, _chainId?: number): Promise<boolean>;
	isExpired(fqdn: string, options?: IOptions, _chainId?: number): Promise<boolean>;
	getDomain(fqdn: string, options?: IOptions): Promise<IGetDomainOutput | undefined>;
	getDomainsByAccount(account: string, options?: IOptions): Promise<IGetDomainOutput[] | undefined>;
	getHost(fqdn: string, options?: IOptions): Promise<IGetHostOutput | undefined>;
	getTtl(fqdn: string, options?: IOptions): Promise<number | undefined>;
	getOwner(fqdn: string, options?: IOptions): Promise<string | undefined>;
	getExpiry(fqdn: string, options?: IOptions): Promise<number | undefined>;
	// getHostsByDomain(fqdn: string, options?: IOptions): Promise<IGetHostOutput[] | undefined>;
	// getRecordsByHost(fqdn: string, options?: IOptions): Promise<string[] | undefined>;
}
