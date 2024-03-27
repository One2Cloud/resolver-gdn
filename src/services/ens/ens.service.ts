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

export class EdnsV2FromEnsSubgraphService { // implements IEdnsResolverService, IEdnsRegistryService {
    public async getAddressRecord(input: IGetAddressRecordInput, options?: IOptions | undefined): Promise<IGetAddressRecordOutput | undefined> {
      const tokensQuery = `
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
      return data.domain !== null ? { address: data.domains[0].resolver.address } : { address: undefined };
    }
  }