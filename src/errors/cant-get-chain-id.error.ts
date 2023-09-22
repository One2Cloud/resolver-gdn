import { BaseError } from "../interfaces/BaseError.interface";

// export class CantGetChainIdError extends Error {
//   public readonly status = 400;
//   constructor(domain: string) {
//     super(domain);
//     this.name = "CANT_GET_CHAIN_ID";
//     this.message = `Unable to get chain ID from ${domain}.`;
//   }
// }

export class CantGetChainIdError extends BaseError {
  constructor(domain: string) {
    super(
      404,
      "CANT_GET_CHAIN_ID",
      `Unable to get chain ID for [${domain}], please provide a chain ID.`
    );
  }
}