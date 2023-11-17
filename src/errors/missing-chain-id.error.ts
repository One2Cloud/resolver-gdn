import { BaseError } from "../interfaces/BaseError.interface";

// export class MissingChainIdError extends Error {
//   public readonly status = 400;
//   constructor() {
//     super();
//     this.name = "MISSING_CHAIN_ID";
//     this.message = `Missing chain ID for query reversed address record.`;
//   }
// }

export class MissingChainIdError extends BaseError {
  constructor() {
    super(
      400,
      "MISSING_CHAIN_ID",
      `Missing chain ID for query reversed address record.`
    );
  }
}
