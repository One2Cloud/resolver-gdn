import { createRedisClient } from "../../utils/create-redis-client";
import _ from "lodash";
import { IOptions } from "../../interfaces/IOptions.interface";
import { extractFqdn } from "../../utils/extract-fqdn";
import { EdnsV2FromSubgraphService } from "./subgraph";
import { Mainnets, Net, Testnets } from "../../network-config";
import { DomainNotFoundError } from "../../errors/domain-not-found.error";

export class EdnsV2FromRedisService {
  public static async isExists(fqdn: string, options?: IOptions, _chainId?: number): Promise<boolean> {
    const redis = await createRedisClient();
    const isExistsFromRedis = await redis.get<number>(`${fqdn}::is_exists`);
    if (isExistsFromRedis !== null) {
      return isExistsFromRedis === 1;
    } else {
      const subgraph = new EdnsV2FromSubgraphService();
      const isExists = await subgraph.isExists(fqdn, options, _chainId);
      await redis.set(`${fqdn}::is_exists`, isExists ? "1" : "0", { ex: 180 });
      return isExists;
    }
  }

  public static async isExpired(fqdn: string, options?: IOptions, _chainId?: number): Promise<boolean> {
    const redis = await createRedisClient();
    const isExpiredFromRedis = await redis.get<number>(`${fqdn}::is_expired`);
    if (isExpiredFromRedis !== null) {
      return isExpiredFromRedis === 1;
    } else {
      const subgraph = new EdnsV2FromSubgraphService();
      const isExpired = await subgraph.isExpired(fqdn, options, _chainId);
      await redis.set(`${fqdn}::is_expired`, isExpired ? "1" : "0", { ex: 180 });
      return isExpired;
    }
  }
  public static async getDomainChainId(fqdn: string, options?: IOptions): Promise<number> {
    const redis = await createRedisClient();
    const { name, tld } = extractFqdn(fqdn);
    const _chainId = await redis.get<number>(`${name}.${tld}::chain_id`);
    if (_chainId) {
      if (_chainId === -1) {
        throw new DomainNotFoundError(fqdn);
      }
      return _chainId;
    }
    const subgraph = new EdnsV2FromSubgraphService();
    const networks = options?.net === Net.TESTNET ? Testnets : Mainnets;
    const responses = await Promise.all(networks.map((_chainId) => subgraph.isExists(fqdn, { net: options?.net || Net.MAINNET, chainId: _chainId })));
    const index = responses.findIndex((r) => r === true);
    const chainId = index === -1 ? -1 : networks[index];
    await redis.set(`${name}.${tld}::chain_id`, chainId, { ex: 180 });
    if (chainId === -1) throw new DomainNotFoundError(fqdn);
    return chainId;
  }
}
