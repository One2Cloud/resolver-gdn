import Redis from "ioredis";
import { REDIS_ENDPOINT } from "../useContract";
import { errorTransform } from "./errorTransform";

let client: Redis | undefined;

export interface IQueryOutput {
  result?: any;
  error?: Error;
}

export class RedisService {
  public async getValueUsingFqdn(fqdn: string, type: string, subtype?: string): Promise<IQueryOutput> {
    if (!client) client = new Redis(REDIS_ENDPOINT);

    let data, _data, queryType;

    // Check whether to get text or typed text
    type === "text" && subtype !== undefined ? (queryType = `typed_text:${subtype}`) : (queryType = type);

    try {
      data = await client.hget(`edns:host:${fqdn}:records`, queryType);
    } catch (err) {
      return {
        error: new Error("REDIS_SERVER_ERROR"),
      };
    }

    if (data === null || data === undefined || data === "") {
      return {
        result: data,
        error: new Error("REDIS_RECORD_NOT_FOUND"),
      };
    } else {
      try {
        _data = { [subtype ? subtype : type]: JSON.parse(data) };
      } catch {
        _data = { [subtype ? subtype : type]: data };
      }

      let isRecordUndefined = false;

      switch (type) {
        case "address":
          if (_data.address === "0x0000000000000000000000000000000000000000") {
            isRecordUndefined = true;
          }
          break;
        case "nft":
          if (_data.nft[0] === "0x0000000000000000000000000000000000000000") {
            isRecordUndefined = true;
          }
          break;
        // case 'text':
        //   if (_data.nft === '') {
        //     isRecordUndefined = true
        //   };
        //   break;
      }

      return {
        error: isRecordUndefined ? new Error("RECORD_UNDEFINED") : undefined,
        result: _data,
      };
    }
  }

  public async getDomainUsingAddress(address: string): Promise<IQueryOutput> {
    if (!client) client = new Redis(REDIS_ENDPOINT);

    let data, _data;

    try {
      data = await client.smembers(`edns:account:${address}:domains`);
      if (data.length > 1) {
        throw new Error();
      }
    } catch (err) {
      return {
        error: new Error("REDIS_SERVER_ERROR"),
      };
    }

    if (data === null || data === undefined || data.length === 0) {
      throw new Error("REDIS_RECORD_NOT_FOUND");
    } else {
      _data = { domain: data };
    }

    return {
      result: _data,
    };
  }
}
