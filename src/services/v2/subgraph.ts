import * as luxon from "luxon";
import _ from "lodash";
import {
  IGetMultiCoinAddressRecordOutput,
  IGetTextRecordOutput,
  IGetTypedTextRecordOutput,
  IGetNftRecordOutput,
  IGetAddressRecordOutput,
  IEdnsResolverService,
  IGetAddressRecordInput,
  IGetMultiCoinAddressRecordInput,
  IGetTypedTextRecordInput,
  IGetNftRecordInput,
  IGetTextRecordInput,
  IGetReverseAddressRecordInput,
  IGetReverseAddressRecordOutput,
  IGetAllRecordsInput,
  IGetAllRecordsOutput,
} from "../../interfaces/IEdnsResolverService.interface";
import { IOptions } from "../../interfaces/IOptions.interface";
import { IEdnsRegistryService, IGetDomainOutput, IGetDomainOutputSubgraph, IGetHostOutput } from "../../interfaces/IEdnsRegistryService.interface";
import { createClient, cacheExchange, fetchExchange } from "urql";
import config from "../../config";

export class EdnsV2FromSubgraphService implements IEdnsResolverService, IEdnsRegistryService {
  private groupByDomainWithCombinedHosts = (data: any): IGetDomainOutputSubgraph[] => {
    const groupedData: any = {};

    for (const item of data) {
      const domain = item.domain.fqdn;
      const host = item.host;

      groupedData[domain] = groupedData[domain] || {
        host: [],
        domain: item.domain, // Copy the entire domain object
      };

      groupedData[domain].host.push(host);
    }

    return Object.values(groupedData); // Convert object to array for consistent output
  };

  public async isExists(fqdn: string, options?: IOptions | undefined, _chainId?: number | undefined): Promise<boolean> {
    const tokensQuery = `
    query MyQuery ($id: ID!){
      host(id: $id) {
        id
        ttl
        host
        fqdn
        domain {
          fqdn
        }
      }
    }
    `;

    const client = createClient({
      url: config.subgraph.url,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: fqdn })
      .toPromise()
      .then((res) => res.data);
    return data.host !== null;
  }
  public async isExpired(fqdn: string, options?: IOptions | undefined, _chainId?: number | undefined): Promise<boolean> {
    const tokensQuery = `
    query MyQuery ($id: ID!){
      domain(id: $id) {
        expiry
      }
    }
    `;

    const client = createClient({
      url: config.subgraph.url,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: fqdn })
      .toPromise()
      .then((res) => res.data);
    let _date;
    data.domain.expiry.toString().length === 10 ? (_date = new Date(data.domain.expiry * 1000)) : (_date = new Date(data.domain.expiry));
    const now = new Date();
    return now.getTime() > _date.getTime();
  }
  public async getDomain(fqdn: string, options?: IOptions | undefined): Promise<IGetDomainOutput | undefined> {
    const { chainId = 137 } = options || {};
    const tokensQuery = `
    query MyQuery ($id: ID!, $_id: String!){
      hosts(where: {domain: $_id}) {
        host
      }
      domain(id: $id) {
        expiry
        fqdn
        id
        name
        operator {
          address
        }
        resolver
        owner {
          address
        }
        user {
          address
          expiry
        }
      }
    }
    `;

    const client = createClient({
      url: config.subgraph.url,
      exchanges: [cacheExchange, fetchExchange],
    });

    let result;
    const data = await client
      .query(tokensQuery, { id: fqdn, _id: fqdn })
      .toPromise()
      .then((res) => res.data);
    console.log(data.domain.owner.address);

    result = {
      chain: chainId,
      owner: data.domain.owner.address,
      expiry: luxon.DateTime.fromSeconds(Number(data.domain.expiry)),
      resolver: data.domain.resolver ? data.domain.resolver : null,
      bridging: undefined,
      operators: data.domain.operator ? [data.domain.operator.address] : null,
      user: {
        address: data.domain.owner.address,
        expiry: luxon.DateTime.fromSeconds(Number(data.domain.expiry)),
      },
      hosts: data.hosts.map((host: { host: string }) => host.host),
    };

    return data.domain !== null
      ? result
      : { chain: undefined, owner: undefined, expiry: undefined, resolver: undefined, bridging: undefined, operators: undefined, user: undefined, hosts: undefined };
  }
  public async getDomainsByAccount(account: string, options?: IOptions | undefined): Promise<IGetDomainOutputSubgraph[] | undefined> {
    const tokensQuery = `
    query MyQuery ($id: ID!, $_id: String!){
      hosts(where: {domain: $_id}) {
        host
      }
      domain(id: $id) {
        expiry
        fqdn
        name
        operator {
          address
        }
        resolver
        owner {
          address
        }
        user {
          address
          expiry
        }
      }
    }
    `;

    const client = createClient({
      url: config.subgraph.url,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: account })
      .toPromise()
      .then((res) => res.data);
    return data.hosts !== null ? this.groupByDomainWithCombinedHosts(data.hosts) : undefined;
  }
  public async getHost(fqdn: string, options?: IOptions | undefined): Promise<IGetHostOutput | undefined> {
    const tokensQuery = `
    query MyQuery ($id: ID!){
      host(id: $id) {
        operator {
          address
        }
        user {
          address
          expiry
        }
        records {
          multiCoinAddressRecord {
            id
          }
          nftRecord {
            id
          }
          podRecord {
            podName
          }
          reverseAddressRecord {
            id
          }
          textRecord {
            id
          }
          typedtextRecord {
            typed
          }
        }
      }
    `;

    const client = createClient({
      url: config.subgraph.url,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: fqdn })
      .toPromise()
      .then((res) => res.data);
    let _record: any[] = [];

    for (const [key, record] of Object.entries(data.host.records)) {
      if (record !== null) {
        _record.push(key);
      }
    }
    return data.host !== null
      ? {
          operators: data.host.operator.address,
          user: {
            address: data.host.user.address,
            expiry: data.host.expiry,
          },
          records: _record,
        }
      : undefined;
  }
  public async getTtl(fqdn: string, options?: IOptions | undefined): Promise<number | undefined> {
    const tokensQuery = `
    query MyQuery ($id: ID!){
      host(id: $id) {
        ttl
      }
    }
    `;

    const client = createClient({
      url: config.subgraph.url,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: fqdn })
      .toPromise()
      .then((res) => res.data);

    return data.host !== null ? data.host.ttl : undefined;
  }
  public async getOwner(fqdn: string, options?: IOptions | undefined): Promise<string | undefined> {
    const tokensQuery = `
    query MyQuery ($id: ID!){
      host(id: $id) {
        owner {
          address
        }
      }
    `;

    const client = createClient({
      url: config.subgraph.url,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: fqdn })
      .toPromise()
      .then((res) => res.data);
    return data.host !== null ? data.host.owner.address : undefined;
  }
  public async getExpiry(fqdn: string, options?: IOptions | undefined): Promise<number | undefined> {
    const tokensQuery = `
    query MyQuery ($id: ID!){
      domain(id: $id) {
        expiry
      }
    }
    `;

    const client = createClient({
      url: config.subgraph.url,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: fqdn })
      .toPromise()
      .then((res) => res.data);
    let _date;
    data.domain.expiry.toString().length === 10 ? (_date = new Date(data.domain.expiry * 1000)) : (_date = new Date(data.domain.expiry));
    return _date.getTime();
  }
  public async getAllRecords(input: IGetAllRecordsInput, options?: IOptions | undefined): Promise<IGetAllRecordsOutput | undefined> {
    const tokensQuery = `
    query Test($id: ID!) {
      records(id: $id) {
        multiCoinAddressRecord {
          id
        }
        nftRecord {
          id
        }
        podRecord {
          id
        }
        reverseAddressRecord {
          id
        }
        textRecord {
          id
        }
        typedtextRecord {
          id
          typed
          text
        }
      }
    }
    `;

    const client = createClient({
      url: config.subgraph.url,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: input.fqdn })
      .toPromise()
      .then((res) => res.data);

    console.log(data);

    return data.records;
  }
  public async getReverseAddressRecord(input: IGetReverseAddressRecordInput, options?: IOptions | undefined): Promise<IGetReverseAddressRecordOutput | undefined> {
    const tokensQuery = `
      query Test($id: ID!){
        reverseAddressRecord (id:$id){
          id
          reverse_address
          records {
            host {
              fqdn
            }
          }
        }
      }
    `;

    const client = createClient({
      url: config.subgraph.url,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: input.address })
      .toPromise()
      .then((res) => res.data);
    return data.reverseAddressRecord !== null ? { fqdn: data.reverseAddressRecord.records.host.fqdn } : { fqdn: undefined };
  }
  public async getAddressRecord(input: IGetAddressRecordInput, options?: IOptions | undefined): Promise<IGetAddressRecordOutput | undefined> {
    const tokensQuery = `
      query Test($id: ID!){
        domain(id: $id) {
          owner {
            address
          }
        }
      }
    `;

    const client = createClient({
      url: config.subgraph.url,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: input.fqdn })
      .toPromise()
      .then((res) => res.data);
    return data.domain !== null ? { address: data.domain.owner.address } : { address: undefined };
  }
  public async getMultiCoinAddressRecord(input: IGetMultiCoinAddressRecordInput, options?: IOptions | undefined): Promise<IGetMultiCoinAddressRecordOutput | undefined> {
    const tokensQuery = `
    query Test($id: ID!){
      multiCoinAddressRecord(id: $id) {
        MultiCoinAddress
        multiCoinId
      }
    }
  `;

    const client = createClient({
      url: config.subgraph.url,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: input.fqdn })
      .toPromise()
      .then((res) => res.data);
    return data.multiCoinAddressRecord !== null
      ? { coin: data.multiCoinAddressRecord.multiCoinId, address: data.multiCoinAddressRecord.MultiCoinAddress }
      : { coin: undefined, address: undefined };
  }
  public async getTextRecord(input: IGetTextRecordInput, options?: IOptions | undefined): Promise<IGetTextRecordOutput | undefined> {
    const tokensQuery = `
    query Test($id: ID!){
      textRecord(id:$id) {
        text
      }
    }
  `;

    const client = createClient({
      url: config.subgraph.url,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: `${input.fqdn}_text` })
      .toPromise()
      .then((res) => res.data);
    return data.textRecord !== null ? { text: data.textRecord.text } : { text: undefined };
  }
  public async getTypedTextRecord(input: IGetTypedTextRecordInput, options?: IOptions | undefined): Promise<IGetTypedTextRecordOutput | undefined> {
    const tokensQuery = `
    query getTypeText($id: ID!){
      typedTextRecord(id: $id) {
        text
        typed
      }
    }
  `;
    const client = createClient({
      url: config.subgraph.url,
      exchanges: [cacheExchange, fetchExchange],
    });
    const data = await client
      .query(tokensQuery, { id: `${input.fqdn}_${input.typed}` })
      .toPromise()
      .then((res) => res.data);

    return data.typedTextRecord !== null ? { typed: data.typedTextRecord.typed, text: data.typedTextRecord.text } : { typed: undefined, text: undefined };
  }
  public async getNftRecord(input: IGetNftRecordInput, options?: IOptions | undefined): Promise<IGetNftRecordOutput | undefined> {
    const tokensQuery = `
    query Test($id: ID!){
      nftrecord(id: $id) {
        tokenId
        contract
        chainId
      }
    }
  `;
    const client = createClient({
      url: config.subgraph.url,
      exchanges: [cacheExchange, fetchExchange],
    });
    const data = await client
      .query(tokensQuery, { id: input.fqdn })
      .toPromise()
      .then((res) => res.data);
    return data.nftrecord !== null
      ? { chainId: data.nftrecord.chainId, contractAddress: data.nftrecord.contract, tokenId: data.nftrecord.tokenId }
      : { chainId: undefined, contractAddress: undefined, tokenId: undefined };
  }
  public async getUrlByPodName(podName: string, options?: IOptions | undefined): Promise<string | undefined> {
    const tokensQuery = `
    query Test($id: ID!)    {
      podRecord(id: $id) {
        url
      }
    }
  `;
    const client = createClient({
      url: config.subgraph.url,
      exchanges: [cacheExchange, fetchExchange],
    });
    const data = await client
      .query(tokensQuery, { id: podName })
      .toPromise()
      .then((res) => res.data);
    return data.podRecord !== null ? data.podRecord.url : undefined;
  }
}
