import { createRedisClient } from "../../utils/create-redis-client";
import _, { chain } from "lodash";
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
    console.log("redis", options);

    const subgraph = new EdnsV2FromSubgraphService();
    const networks = options?.net === Net.TESTNET ? Testnets : Mainnets;
    const responses = await Promise.all(networks.map((_chainId) => subgraph.isExists(fqdn, { net: options?.net || Net.MAINNET, chainId: _chainId })));
    const index = responses.findIndex((r) => r === true);
    const chainId = index === -1 ? -1 : networks[index];
    await redis.set(`${name}.${tld}::chain_id`, chainId, { ex: 180 });
    if (chainId === -1) throw new DomainNotFoundError(fqdn);
    return chainId;
  }
  public static async getDomainByPodName(podName: string, options?: IOptions) {
    const redis = await createRedisClient();
    const networks = options?.net === Net.TESTNET ? Testnets : Mainnets;
    const subgraph = new EdnsV2FromSubgraphService();
    const podChain = await redis.get<number>(`${podName}:pod:chain_id`);
    if (podChain) {
      if (podChain === -1) {
        throw new Error("No Pod record found");
      }
      console.log("found one");
      return podChain;
    }
    const responses = await Promise.all(networks.map((_chainId) => subgraph.checkpod(podName, { net: options?.net || Net.MAINNET, chainId: _chainId })));
    console.log(responses);

    const resultArray: number[] = [];
    const index = responses.map((r, i) => {
      r === true ? resultArray.push(i) : null;
    });

    let _chain: any[] | number = [];
    const chainId = resultArray.length == 0 ? -1 : resultArray.length == 1 ? networks[resultArray[0]] : resultArray.map((_index) => _chain.push(networks[_index]));

    console.log("redis service", _chain);
    await redis.set(`${podName}:pod:chain_id`, _chain, { ex: 180 });
    // await redis.set(`${podName}::chain_id`, chainId, { ex: 180 });
    if (chainId === -1) throw new Error("Pod not found");
    return chainId;
  }

  public static async getWalletChainId(walletAddress: string, options?: IOptions) {
    const redis = await createRedisClient();
    const _chainId = await redis.get<number>(`${walletAddress}:user:${options?.net === Net.TESTNET ? "testnet" : "mainnet"}:chain_id`);
    if (_chainId) {
      if (_chainId === -1) {
        throw new Error(`No Record for ${walletAddress}`);
      }
      return _chainId;
    }
    console.log("redis", options);
    const subgraph = new EdnsV2FromSubgraphService();
    const networks = options?.net === Net.TESTNET ? Testnets : Mainnets;
    const responses = await Promise.all(networks.map((_chainId) => subgraph.checkAddressChainId(walletAddress, { net: options?.net || Net.MAINNET, chainId: _chainId })));
    const resultArray: number[] = [];
    const index = responses.map((r, i) => {
      r === true ? resultArray.push(i) : null;
    });
    console.log("response", responses);

    let _chain: any[] | number = [];
    const chainId = resultArray.length == 0 ? -1 : resultArray.length == 1 ? networks[resultArray[0]] : resultArray.map((_index) => _chain.push(networks[_index]));
    console.log("redis service", chainId);
    await redis.set(`${walletAddress}:user:${options?.net === Net.TESTNET ? "testnet" : "mainnet"}:chain_id`, resultArray.length <= 1 ? chainId : _chain, { ex: 180 });
    // await redis.set(`${podName}::chain_id`, chainId, { ex: 180 });
    if (chainId === -1) throw new Error("Address not found");
    return chainId;
  }
}
