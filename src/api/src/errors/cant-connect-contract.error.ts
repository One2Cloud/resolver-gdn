import { BaseError } from "../interfaces/BaseError.interface";

// export class CantConnectContractError extends Error {
//   public readonly status = 400;
//   constructor(chainId: number) {
//     super(String(chainId));
//     this.name = "CANT_CONNECT_CONTRACT";
//     this.message = `Unable to connect contract of chain ID ${chainId}.`;
//   }
// }

export class CantConnectContractError extends BaseError {
  constructor(chainId: number) {
    super(
      503,
      "CANT_CONNECT_CONTRACT",
      `Unable to connect contract of chain ID [${chainId}].`
    );
  }
}