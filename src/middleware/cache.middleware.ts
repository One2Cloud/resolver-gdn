import { Request, Response, NextFunction } from "express";
import { createRedisClient } from "../utils/create-redis-client";
import * as crypto from "crypto";
import { IGeneralResponse } from "../interfaces/IGeneralOutput.interface";
export async function PreCacheHandler(req: Request, res: Response, next: NextFunction) {
  const redis = await createRedisClient();
  const key = crypto.createHash("md5").update(req.originalUrl).digest("hex");
  const raw = await redis.get<string>(`cache::${key}`);
    if (raw) {
    //   req.
    const response: IGeneralResponse<any> = JSON.parse(raw);
    res.status(response.status).json(response);
  } else {
    next();
  }
}

export async function PostCacheHandler(req: Request, res: Response, next: NextFunction) {

}
