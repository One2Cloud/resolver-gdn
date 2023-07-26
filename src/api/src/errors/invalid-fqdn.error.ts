import { BaseError } from "../interfaces/BaseError.interface";

// export class InvalidFqdnError extends Error {
//   public readonly status = 400;
//   constructor(fqdn: string) {
//     super(fqdn);
//     this.name = "INVALID_FQDN";
//     this.message = `Invalid FQDN: [${fqdn}]`;
//   }
// }

export class InvalidFqdnError extends BaseError {
  constructor(fqdn: string) {
    super(
      400,
      "INVALID_FQDN",
      `Invalid FQDN: [${fqdn}]`
    );
  }
}