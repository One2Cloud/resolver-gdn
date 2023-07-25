import { extractFqdn } from "../utils/extract-fqdn";

export class DomainExpiredError extends Error {
  public readonly status = 200;
  constructor(fqdn: string) {
    super(fqdn);
    const { name, tld } = extractFqdn(fqdn);
    const domain = [name, tld].join(".");
    this.name = "DOMAIN_EXPIRED";
    this.message = `Domain [${domain}] is expired.`;
  }
}