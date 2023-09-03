import { extractFqdn } from "../utils/extract-fqdn";
import { BaseError } from "../interfaces/BaseError.interface";

// export class DomainExpiredError extends Error {
//   public readonly status = 200;
//   constructor(fqdn: string) {
//     super(fqdn);
//     const { name, tld } = extractFqdn(fqdn);
//     const domain = [name, tld].join(".");
//     this.name = "DOMAIN_EXPIRED";
//     this.message = `Domain [${domain}] is expired.`;
//   }
// }

export class DomainExpiredError extends BaseError {
  constructor(fqdn: string) {
    const { name, tld } = extractFqdn(fqdn);
    const domain = [name, tld].join(".");
    super(
      200,
      "DOMAIN_EXPIRED",
      `Domain [${domain}] is expired.`
    );
  }
}