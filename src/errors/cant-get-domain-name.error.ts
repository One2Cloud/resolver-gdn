import { extractFqdn } from "../utils/extract-fqdn";
import { BaseError } from "../interfaces/BaseError.interface";

// export class CantGetDomainNameError extends Error {
//   public readonly status = 400;
//   constructor(fqdn: string) {
//     super(fqdn);
//     this.name = "CANT_GET_DOMAIN_NAME";
//     this.message = `Unable to get domain name from ${fqdn}.`;
//   }
// }

export class CantGetDomainNameError extends BaseError {
  constructor(fqdn: string) {
    const { name, tld } = extractFqdn(fqdn);
    const domain = [name, tld].join(".");
    super(400, "CANT_GET_DOMAIN_NAME", `Unable to get domain name from [${domain}].`);
  }
}
