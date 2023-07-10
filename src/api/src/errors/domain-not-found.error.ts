import { extractFqdn } from "../utils/extract-fqdn";

export class DomainNotFoundError extends Error {
  public readonly status = 200;
  constructor(fqdn: string) {
    super(fqdn);
    const { name, tld } = extractFqdn(fqdn);
    const domain = [name, tld].join(".");
    this.name = "DOMAIN_NOT_FOUND";
    this.message = `Domain [${domain}] not found`;
  }
}
