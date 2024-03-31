import * as luxon from "luxon";
import _ from "lodash";
import {
  IGetMultiCoinAddressRecordOutput,
  IGetTextRecordOutput,
  IGetTypedTextRecordOutput,
  IGetNftRecordOutput,
  IGetAddressRecordOutput,
  IEnsSubgraphService,
  IGetAddressRecordInput,
  IGetMultiCoinAddressRecordInput,
  IGetTypedTextRecordInput,
  IGetNftRecordInput,
  IGetTextRecordInput,
  IGetReverseAddressRecordInput,
  IGetReverseAddressRecordOutput,
  IGetAllRecordsInput,
  IGetAllRecordsOutput,
} from "../../interfaces/IEnsSubgraphService.interface";
import { IOptions } from "../../interfaces/IOptions.interface";
import { IEdnsRegistryService, IGetDomainOutput, IGetDomainOutputSubgraph, IGetHostOutput } from "../../interfaces/IEdnsRegistryService.interface";
import { createClient, cacheExchange, fetchExchange } from "urql";
import config from "../../config";

export class EdnsV2FromEnsSubgraphService implements IEnsSubgraphService {
    public async getAddressRecord(input: IGetAddressRecordInput, options?: IOptions | undefined): Promise<IGetAddressRecordOutput | undefined> {
      const tokensQuery =
      `
        query getENSName($fqdn: String!) {
          domains(where: {name: $fqdn}) {
            resolver {
              address
            }
          }
        }
      `;
  
      const client = createClient({
        url: config.ens_subgraph.url,
        exchanges: [cacheExchange, fetchExchange],
      });
      const data = await client
        .query(tokensQuery, { fqdn: input.fqdn })
        .toPromise()
        .then((res) => res.data);
      console.log(data)
      return data.domains.length > 0 ? { address: data.domains[0].resolver.address } : { address: undefined };
    }
    public async getMultiCoinAddressRecord(input: IGetMultiCoinAddressRecordInput, options?: IOptions | undefined): Promise<IGetMultiCoinAddressRecordOutput | undefined> {
        const tokensQuery =
        `
          query getENSName($fqdn: String!) {
            domains(where: {name: $fqdn}) {
              resolver {
                coinTypes
                address
              }
            }
          }
        `; // TO-DO: No coin id?
        console.log(input.fqdn)
        const client = createClient({
          url: config.ens_subgraph.url,
          exchanges: [cacheExchange, fetchExchange],
        });
        console.log("reach here 7")
        const data = await client
          .query(tokensQuery, { fqdn: input.fqdn })
          .toPromise()
          .then((res) => res.data);
        console.log(data)
        const targetCoinDomain = data.domains.find((domain: { resolver: { coinTypes: string | string[]; }; }) => domain.resolver.coinTypes.includes(input.coin))
        console.log(targetCoinDomain)
        // return data.domains[0].resolver.coinTypes.length > 0 // TO-DO: List of result?
        //   ? { coin: data.domains[0].resolver.coinTypes[0], address: data.domains[0].resolver.address }
        //   : { coin: undefined, address: undefined };
        return targetCoinDomain.resolver.coinTypes.length > 0 // TO-DO: List of result?
        ? { coin: targetCoinDomain.resolver.coinTypes[0], address: targetCoinDomain.resolver.address }
        : { coin: undefined, address: undefined };
      }
  }

  