import { Request, Response, NextFunction } from "express";
// export const sendResponse = (res: Response, data: any, status = 200, on_chain = false, func = '') => {
//   return res.status(status).json({
//     status,
//     on_chain,
//     function: func,
//     data,
//     error: null,
//   });
// };

// const sendError = (res: Response, message: string, status = 500, on_chain = false, func = '') => {
//   return res.status(status).json({
//     status,
//     on_chain,
//     function: func,
//     data: null,
//     error: message,
//   });
// };

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
  let status = Number(res.get("Status")) || 500;
  let isOnChain = res.get("On-Chain") || undefined;
  let func = res.get("Function") || null;
  let data = res.locals.result || null;
  let errorMessage = "There is an internal server error";

  switch (err.message) {
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
    case "DOMAIN_NOT_EXISTS":
      status = 404;
      errorMessage = "Your domain does not exist on chain.";
      break;
  }

  console.log(err);
  return res.status(status).json({
    status,
    isOnChain,
    function: func,
    data,
    error: {
      code: err.message,
      message: errorMessage,
    },
  });
}
