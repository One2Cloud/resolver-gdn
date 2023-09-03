import { extractFqdn } from "../utils/extract-fqdn";
import { BaseError } from "../interfaces/BaseError.interface";

// export class DomainNotFoundError extends Error {
//   public readonly status = 200;
//   constructor(fqdn: string) {
//     super(fqdn);
//     const { name, tld } = extractFqdn(fqdn);
//     const domain = [name, tld].join(".");
//     this.name = "DOMAIN_NOT_FOUND";
//     this.message = `Domain [${domain}] not found`;
//   }
// }

export class DomainNotFoundError extends BaseError {
  constructor(fqdn: string) {
    const { name, tld } = extractFqdn(fqdn);
    const domain = [name, tld].join(".");
    super(
      200,
      "DOMAIN_NOT_FOUND",
      `Domain [${domain}] not found.`
    );
  }
}