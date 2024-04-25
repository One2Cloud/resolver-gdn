import * as luxon from "luxon";
import _, { add, chain } from "lodash";
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
  IGenericInput,
} from "../../interfaces/IEdnsResolverService.interface";
import { IOptions } from "../../interfaces/IOptions.interface";
import { IEdnsRegistryService, IGetDomainOutput, IGetDomainOutputSubgraph, IGetHostOutput } from "../../interfaces/IEdnsRegistryService.interface";
import { createClient, cacheExchange, fetchExchange } from "urql";
import config from "../../config";
import { Net } from "../../network-config";
import { DomainNotFoundError } from "../../errors/domain-not-found.error";
import { DomainExpiredError } from "../../errors/domain-expired.error";
import { EdnsV2FromRedisService } from "./redis";
import { extractFqdn } from "../../utils/extract-fqdn";
import { IDomainDetailsOutput, IDomainType, IGetWalletInfoOutput, IWalletDomainDetailsOutput } from "./subgraph.interface";
import { ethers } from "ethers";

export class EdnsV2FromSubgraphService implements IEdnsResolverService, IEdnsRegistryService {
  private async _queryPreCheck(chainId: number, input: IGenericInput, options?: IOptions): Promise<void> {
    const isExists = await EdnsV2FromRedisService.isExists(input.fqdn, { ...options, chainId }, chainId);
    if (!isExists) throw new DomainNotFoundError(input.fqdn);
    const isExpired = await EdnsV2FromRedisService.isExpired(input.fqdn, { ...options, chainId }, chainId);
    if (isExpired) throw new DomainExpiredError(input.fqdn);
  }

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
    console.log("subgraph", options);

    const chainId = options?.chainId || _chainId || (await EdnsV2FromRedisService.getDomainChainId(fqdn, options));
    console.log("subgraph", chainId);
    const tokensQuery = `
    query MyQuery ($id: ID!){
      host(id: $id) {
        id
      }
    }
    `;

    const client = createClient({
      url: `${options?.net === Net.TESTNET ? config.subgraph.testnet.http.endpoint : config.subgraph.mainnet.http.endpoint}/subgraphs/name/edns-${options?.chainId || chainId}`,
      exchanges: [cacheExchange, fetchExchange],
    });

    console.log(
      `${options?.net === Net.TESTNET ? config.subgraph.testnet.http.endpoint : config.subgraph.mainnet.http.endpoint}/subgraphs/name/edns-${options?.chainId || chainId}`,
    );
    const data = await client
      .query(tokensQuery, { id: fqdn })
      .toPromise()
      .then((res) => res.data);

    return !!data?.host;
  }

  public async isExpired(fqdn: string, options?: IOptions | undefined, _chainId?: number | undefined): Promise<boolean> {
    const chainId = options?.chainId || _chainId || (await EdnsV2FromRedisService.getDomainChainId(fqdn, options));

    const tokensQuery = `
    query MyQuery ($id: ID!){
      domain(id: $id) {
        expiry
      }
    }
    `;

    const client = createClient({
      url: `${options?.net === Net.TESTNET ? config.subgraph.testnet.http.endpoint : config.subgraph.mainnet.http.endpoint}/subgraphs/name/edns-${options?.chainId || chainId}`,
      exchanges: [cacheExchange, fetchExchange],
    });

    const { name, tld } = extractFqdn(fqdn);
    const data = await client
      .query(tokensQuery, { id: `${name}.${tld}` })
      .toPromise()
      .then((res) => res.data);
    const expiry = data?.domain.expiry.toString().length === 10 ? luxon.DateTime.fromSeconds(Number(data.domain.expiry)) : luxon.DateTime.fromMillis(Number(data.domain.expiry));
    return luxon.DateTime.now() > expiry;
  }

  public async getDomain(fqdn: string, options?: IOptions | undefined): Promise<IGetDomainOutput | undefined> {
    const chainId = await EdnsV2FromRedisService.getDomainChainId(fqdn, options);
    await this._queryPreCheck(chainId, { fqdn }, options);

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
      url: `${options?.net === Net.TESTNET ? config.subgraph.testnet.http.endpoint : config.subgraph.mainnet.http.endpoint}/subgraphs/name/edns-${options?.chainId || chainId}`,
      exchanges: [cacheExchange, fetchExchange],
    });

    let result;
    const data = await client
      .query(tokensQuery, { id: fqdn, _id: fqdn })
      .toPromise()
      .then((res) => res.data);

    result = {
      chain: chainId,
      owner: data.domain.owner.address,
      expiry: data?.domain.expiry.toString().length === 10 ? luxon.DateTime.fromSeconds(Number(data.domain.expiry)) : luxon.DateTime.fromMillis(Number(data.domain.expiry)),
      resolver: data.domain.resolver ? data.domain.resolver : null,
      bridging: undefined,
      operators: data.domain.operator ? [data.domain.operator.address] : null,
      user: {
        address: data.domain.owner.address,
        expiry: data?.domain.expiry.toString().length === 10 ? luxon.DateTime.fromSeconds(Number(data.domain.expiry)) : luxon.DateTime.fromMillis(Number(data.domain.expiry)),
      },
      hosts: data.hosts.map((host: { host: string }) => host.host),
    };

    return !!data.domain
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
      url: `${options?.net === Net.TESTNET ? config.subgraph.testnet.http.endpoint : config.subgraph.mainnet.http.endpoint}/subgraphs/name/edns-${options?.chainId}`,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: account })
      .toPromise()
      .then((res) => res.data);
    return !!data.hosts ? this.groupByDomainWithCombinedHosts(data.hosts) : undefined;
  }

  public async getHost(fqdn: string, options?: IOptions | undefined): Promise<IGetHostOutput | undefined> {
    const chainId = await EdnsV2FromRedisService.getDomainChainId(fqdn, options);
    await this._queryPreCheck(chainId, { fqdn }, options);

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
    }
    `;

    const client = createClient({
      url: `${options?.net === Net.TESTNET ? config.subgraph.testnet.http.endpoint : config.subgraph.mainnet.http.endpoint}/subgraphs/name/edns-${options?.chainId || chainId}`,
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

    return !!data?.host
      ? {
          operators: data.host.operator?.address,
          user: {
            address: data.host.user?.address,
            expiry: data?.host.expiry.toString().length === 10 ? luxon.DateTime.fromSeconds(Number(data.host.expiry)) : luxon.DateTime.fromMillis(Number(data.host.expiry)),
          },
          records: _record,
        }
      : undefined;
  }
  public async getTtl(fqdn: string, options?: IOptions | undefined): Promise<number | undefined> {
    const chainId = await EdnsV2FromRedisService.getDomainChainId(fqdn, options);
    await this._queryPreCheck(chainId, { fqdn }, options);

    const tokensQuery = `
    query MyQuery ($id: ID!){
      host(id: $id) {
        ttl
      }
    }
    `;

    const client = createClient({
      url: `${options?.net === Net.TESTNET ? config.subgraph.testnet.http.endpoint : config.subgraph.mainnet.http.endpoint}/subgraphs/name/edns-${options?.chainId || chainId}`,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: fqdn })
      .toPromise()
      .then((res) => res.data);

    return data?.host?.ttl;
  }
  public async getOwner(fqdn: string, options?: IOptions | undefined): Promise<string | undefined> {
    const chainId = await EdnsV2FromRedisService.getDomainChainId(fqdn, options);
    await this._queryPreCheck(chainId, { fqdn }, options);

    const tokensQuery = `
    query MyQuery ($id: ID!){
      host(id: $id) {
        owner {
          address
        }
      }
    `;

    const client = createClient({
      url: `${options?.net === Net.TESTNET ? config.subgraph.testnet.http.endpoint : config.subgraph.mainnet.http.endpoint}/subgraphs/name/edns-${options?.chainId || chainId}`,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: fqdn })
      .toPromise()
      .then((res) => res.data);
    return data?.host?.owner?.address;
  }
  public async getExpiry(fqdn: string, options?: IOptions | undefined): Promise<number | undefined> {
    const chainId = await EdnsV2FromRedisService.getDomainChainId(fqdn, options);
    await this._queryPreCheck(chainId, { fqdn }, options);

    const tokensQuery = `
    query MyQuery ($id: ID!){
      domain(id: $id) {
        expiry
      }
    }
    `;

    const client = createClient({
      url: `${options?.net === Net.TESTNET ? config.subgraph.testnet.http.endpoint : config.subgraph.mainnet.http.endpoint}/subgraphs/name/edns-${options?.chainId || chainId}`,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: fqdn })
      .toPromise()
      .then((res) => res.data);
    return data?.domain.expiry.toString().length === 10
      ? luxon.DateTime.fromSeconds(Number(data.domain.expiry)).toMillis()
      : luxon.DateTime.fromMillis(Number(data.domain.expiry)).toMillis();
  }
  public async getAllRecords(input: IGetAllRecordsInput, options?: IOptions | undefined): Promise<IGetAllRecordsOutput | undefined> {
    const chainId = await EdnsV2FromRedisService.getDomainChainId(input.fqdn, options);
    await this._queryPreCheck(chainId, input, options);

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
          text
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
      url: `${options?.net === Net.TESTNET ? config.subgraph.testnet.http.endpoint : config.subgraph.mainnet.http.endpoint}/subgraphs/name/edns-${options?.chainId || chainId}`,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: input.fqdn })
      .toPromise()
      .then((res) => {
        return { ...res.data, records: _.omitBy(res.data.records, _.isEmpty) };
      });

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
      url: `${options?.net === Net.TESTNET ? config.subgraph.testnet.http.endpoint : config.subgraph.mainnet.http.endpoint}/subgraphs/name/edns-${options?.chainId}`,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: input.address })
      .toPromise()
      .then((res) => res.data);
    return { fqdn: data?.reverseAddressRecord?.records?.host?.fqdn };
  }
  public async getAddressRecord(input: IGetAddressRecordInput, options?: IOptions | undefined): Promise<IGetAddressRecordOutput | undefined> {
    const chainId = await EdnsV2FromRedisService.getDomainChainId(input.fqdn, options);

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
      url: `${options?.net === Net.TESTNET ? config.subgraph.testnet.http.endpoint : config.subgraph.mainnet.http.endpoint}/subgraphs/name/edns-${options?.chainId || chainId}`,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: input.fqdn })
      .toPromise()
      .then((res) => res.data);

    return { address: data?.domain?.owner?.address };
  }
  public async getMultiCoinAddressRecord(input: IGetMultiCoinAddressRecordInput, options?: IOptions | undefined): Promise<IGetMultiCoinAddressRecordOutput | undefined> {
    const chainId = await EdnsV2FromRedisService.getDomainChainId(input.fqdn, options);
    await this._queryPreCheck(chainId, input, options);

    const tokensQuery = `
    query Test($id: ID!){
      multiCoinAddressRecord(id: $id) {
        MultiCoinAddress
        multiCoinId
      }
    }
  `;

    const client = createClient({
      url: `${options?.net === Net.TESTNET ? config.subgraph.testnet.http.endpoint : config.subgraph.mainnet.http.endpoint}/subgraphs/name/edns-${options?.chainId || chainId}`,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: input.fqdn })
      .toPromise()
      .then((res) => res.data);
    return { coin: data?.multiCoinAddressRecord?.multiCoinId, address: data?.multiCoinAddressRecord?.MultiCoinAddress };
  }
  public async getTextRecord(input: IGetTextRecordInput, options?: IOptions | undefined): Promise<IGetTextRecordOutput | undefined> {
    const chainId = await EdnsV2FromRedisService.getDomainChainId(input.fqdn, options);
    await this._queryPreCheck(chainId, input, options);

    const tokensQuery = `
    query Test($id: ID!){
      textRecord(id:$id) {
        text
      }
    }
  `;

    const client = createClient({
      url: `${options?.net === Net.TESTNET ? config.subgraph.testnet.http.endpoint : config.subgraph.mainnet.http.endpoint}/subgraphs/name/edns-${options?.chainId || chainId}`,
      exchanges: [cacheExchange, fetchExchange],
    });

    const data = await client
      .query(tokensQuery, { id: `${input.fqdn}` })
      .toPromise()
      .then((res) => res.data);
    return { text: data?.textRecord?.text };
  }
  public async getTypedTextRecord(input: IGetTypedTextRecordInput, options?: IOptions | undefined): Promise<IGetTypedTextRecordOutput | undefined> {
    console.log("options", options);
    const chainId = await EdnsV2FromRedisService.getDomainChainId(input.fqdn, options);
    await this._queryPreCheck(chainId, input, { ...options, chainId });
    const tokensQuery = `
    query getTypeText($id: ID!){
      typedTextRecord(id: $id) {
        text
        typed
      }
    }
  `;
    const client = createClient({
      url: `${options?.net === Net.TESTNET ? config.subgraph.testnet.http.endpoint : config.subgraph.mainnet.http.endpoint}/subgraphs/name/edns-${options?.chainId || chainId}`,
      exchanges: [cacheExchange, fetchExchange],
    });
    const data = await client
      .query(tokensQuery, { id: `${input.fqdn}_${input.typed}` })
      .toPromise()
      .then((res) => res.data);

    return { typed: input.typed, text: data?.typedTextRecord?.text || "" };
  }
  public async getNftRecord(input: IGetNftRecordInput, options?: IOptions | undefined): Promise<IGetNftRecordOutput | undefined> {
    const chainId = await EdnsV2FromRedisService.getDomainChainId(input.fqdn, options);
    await this._queryPreCheck(chainId, input, options);

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
      url: `${options?.net === Net.TESTNET ? config.subgraph.testnet.http.endpoint : config.subgraph.mainnet.http.endpoint}/subgraphs/name/edns-${options?.chainId || chainId}`,
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
  public async getUrlByPodName(podName: string, options?: IOptions | undefined) {
    const chainId = await EdnsV2FromRedisService.getDomainByPodName(podName, options);

    const tokensQuery = `
    query Test($id: ID!)    {
      podRecord(id: $id) {
        url
      }
    }
    `;
    console.log(typeof chainId, chainId);
    const getdata = async (_chainId: number): Promise<any> => {
      const client = createClient({
        url: `${options?.net === Net.TESTNET ? config.subgraph.testnet.http.endpoint : config.subgraph.mainnet.http.endpoint}/subgraphs/name/edns-${_chainId}`,
        exchanges: [cacheExchange, fetchExchange],
      });
      const data = await client
        .query(tokensQuery, { id: podName })
        .toPromise()
        .then((res) => res.data);
      return !!data?.podRecord?.url ? data.podRecord.url : undefined;
    };

    if (typeof chainId === "number") {
      return getdata(chainId);
    }

    if (Array.isArray(chainId)) {
      console.log("in loop", chainId);

      const _r: string[] = [];
      await Promise.all(
        chainId.map(async (r) => {
          _r.push(await getdata(r));
        }),
      );

      return _r;
    }
  }

  public async checkpod(podName: string, options?: IOptions | undefined): Promise<boolean> {
    console.log(options?.chainId);

    const tokensQuery = `
    query Test($id: ID!)    {
      podRecord(id: $id) {
        id
      }
    }
  `;

    const client = createClient({
      url: `${options?.net === Net.TESTNET ? config.subgraph.testnet.http.endpoint : config.subgraph.mainnet.http.endpoint}/subgraphs/name/edns-${options?.chainId}`,
      exchanges: [cacheExchange, fetchExchange],
    });
    const data = await client
      .query(tokensQuery, { id: podName })
      .toPromise()
      .then((res) => res.data);
    console.log(data?.podRecord);
    return data?.podRecord != null;
  }

  public async getUserDomainByChainId(account: string, chainId: number, options?: IOptions | undefined) {}

  public async getWalletInfo(address: string, options?: IOptions | undefined): Promise<IGetWalletInfoOutput | undefined> {
    try {
      const chainId = await EdnsV2FromRedisService.getWalletChainId(address, options);
      const tokensQuery = `
      query MyQuery($id: ID!) {
        domains(where: {owner_: {id: $id}}) {
          owner{
            id
          }
          tld {
            tldClass
          }
          fqdn
          expiry
        }
      }
    `;

      const getdata = async (_chainId: number): Promise<any> => {
        const client = createClient({
          url: `${options?.net === Net.TESTNET ? config.subgraph.testnet.http.endpoint : config.subgraph.mainnet.http.endpoint}/subgraphs/name/edns-${_chainId}`,
          exchanges: [cacheExchange, fetchExchange],
        });
        const data = await client
          .query(tokensQuery, { id: address })
          .toPromise()
          .then((res) => res.data);
        return !!data?.domains ? data.domains : undefined;
      };

      const getTokenId = (fqdn: string) => {
        const bytes32 = ethers.utils.solidityKeccak256(["bytes"], [ethers.utils.toUtf8Bytes(fqdn)]);
        const tokenId = ethers.BigNumber.from(bytes32).toString();
        return tokenId;
      };

      if (typeof chainId === "number") {
        const _r = await getdata(chainId);
        if (_r.length === 1) {
          console.log(_r);

          const data: IGetWalletInfoOutput = {
            address: address,
            resversedDomain: null,
            domains: {
              fqdn: _r.fqdn,
              chainId: chainId,
              type: _r.tld.tldClass,
              tokenId: getTokenId(_r.fqdn),
              expiryDate: new Date(_r.expiry * 1000).valueOf(),
            },
          };
          return data;
        } else {
          const trimResult: IWalletDomainDetailsOutput[] = [];

          _r.map((r: any) => {
            console.log(r);
            trimResult.push({
              fqdn: r.fqdn,
              chainId: chainId,
              type: r.tld.tldClass,
              tokenId: getTokenId(r.fqdn),
              expiryDate: new Date(r.expiry * 1000).valueOf(),
            });
          });
          return {
            address: address,
            resversedDomain: null,
            domains: trimResult,
          };
        }
      }

      if (Array.isArray(chainId)) {
        console.log("in service check array", chainId);

        const _r: IWalletDomainDetailsOutput[] = [];
        await Promise.all(
          chainId.map(async (r, i) => {
            const loopResult = await getdata(r);
            loopResult.map((r: any) => {
              console.log("loopResult", r);
              _r.push({
                fqdn: r.fqdn,
                chainId: chainId[i],
                type: r.tld.tldClass,
                tokenId: getTokenId(r.fqdn),
                expiryDate: new Date(r.expiry * 1000).valueOf(),
              });
            });
          }),
        );
        return {
          address: address,
          resversedDomain: null,
          domains: _r,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  public async checkAddressChainId(address: string, options?: IOptions | undefined) {
    console.log("checkChainId subgraph", options?.chainId);

    const tokensQuery = `
    query Test($id: ID!)    {
      user(id: $id) {
        id
      }
    }
  `;

    const client = createClient({
      url: `${options?.net === Net.TESTNET ? config.subgraph.testnet.http.endpoint : config.subgraph.mainnet.http.endpoint}/subgraphs/name/edns-${options?.chainId}`,
      exchanges: [cacheExchange, fetchExchange],
    });
    const data = await client
      .query(tokensQuery, { id: address })
      .toPromise()
      .then((res) => res.data);
    console.log("checkAddressChainId", data);
    return data?.user != null;
  }

  public async getDomainDetails(address: string): Promise<IDomainDetailsOutput> {
    //TODO for edns-v3
    return {
      chainId: 136,
      type: IDomainType.UNIVERSAL,
      owner: "string",
      tokenId: "string",
      expiryDate: new Date().valueOf(),
      records: {
        text: "",
        address: "",
        typedText: {
          Email: "",
        },
        typedAddress: {
          BTC: "0xabxxx....",
        },
      },
    };
  }
}
