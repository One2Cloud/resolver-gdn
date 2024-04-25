import { Request, Response, NextFunction } from "express";
import { createRedisClient } from "../utils/create-redis-client";
import * as crypto from "crypto";
import EventEmitter from "node:events";
import { IGeneralResponse } from "../interfaces/IGeneralOutput.interface";

const postCacheEventEmitter = new EventEmitter();
postCacheEventEmitter.on("response", async (url: string, data: IGeneralResponse<any>) => {
  try {
    const key = crypto.createHash("md5").update(url).digest("hex");
    const redis = await createRedisClient();
    redis.set(`cache:${key}`, JSON.stringify(data), { ex: 60 });
  } catch (error) {
    console.error(error);
  }
});

export async function PreCacheHandler(req: Request, res: Response, next: NextFunction) {
  const redis = await createRedisClient();
  if (req.query.cache === "0") return next();
  const key = crypto.createHash("md5").update(req.originalUrl).digest("hex");
  const response = await redis.get<IGeneralResponse<any>>(`cache:${key}`);
  if (!response) return next();
  return res.status(response.status).json(response);
}

export async function PostCacheHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.query.cache === "0") return next();
    const original_json = res.json;
    res.json = (data: IGeneralResponse<any>) => {
      if (data) postCacheEventEmitter.emit("response", req.originalUrl, data);
      return original_json.call(res, data);
    };
    next();
  } catch (error) {
    next(error);
  }
}
