import { Request, Response, NextFunction } from "express";
import { IGeneralResponse } from "../interfaces/IGeneralOutput.interface";

export function responseHandler(req: Request, res: Response, next: NextFunction) {
  const status = Number(res.get("Status")) || 200;
  const isOnChain = res.get("On-Chain") || undefined;
  const func = res.get("Function") || null;
  const data = res.locals.result;

  return res.status(status).json({
    status,
    isOnChain,
    function: func,
    data,
    error: null,
  });
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  let status = 500;
  let onchain = !!req.query.onchain;

  const errorCode = err.name || "UNKNOWN_ERROR";
  let errorMessage = err.message;
  switch (err.name) {
    // From new error
    case "UNKNOWN_ROUTE":
      status = 404;
      errorMessage = "Unknown operation. Please check your URL parameters.";
      break;
    case "REDIS_RECORD_NOT_FOUND":
      status = 404;
      errorMessage = "Your query record is not found on Redis.";
      break;
    case "REDIS_SERVER_ERROR":
      status = 502;
      errorMessage = "There is an error when connecting to Redis server.";
      break;
    case "RECORD_NOT_FOUND":
      status = 404;
      errorMessage = "Your query record is not found on chain.";
      break;
    case "RECORD_UNDEFINED":
      status = 404;
      errorMessage = "Your query record is undefined on chain.";
      break;
    case "ON_CHAIN_UNEXPECTED_ERROR":
      status = 502;
      errorMessage = "There is an error when attempting to get records on chain.";
      break;
    case "INVALID_DOMAIN":
      status = 404;
      errorMessage = "The domain you entered is not a valid domain.";
      break;
    case "INVALID_ADDRESS_FORMAT":
      status = 404;
      errorMessage = "The address you entered is not a valid address.";
      break;

    // From contract reasons

    case "DOMAIN_EXPIRED":
      status = 404;
      errorMessage = "Your domain have already been expired.";
      break;
    case "DOMAIN_NOT_FOUND":
      // case "DOMAIN_NOT_EXISTS":
      status = 404;
      if (!errorMessage) errorMessage = "Your domain does not exist on chain.";
      break;
  }

  console.error(err);

  const response: IGeneralResponse<undefined> = {
    status,
    onchain,
    success: false,
    error: {
      code: errorCode,
      reason: errorMessage,
    },
    empty: true
  };

  return res.status(status).json(response);
}
