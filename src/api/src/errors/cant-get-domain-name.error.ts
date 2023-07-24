export class CantGetDomainNameError extends Error {
  public readonly status = 400;
  constructor(fqdn: string) {
    super(fqdn);
    this.name = "CANT_GET_DOMAIN_NAME";
    this.message = `Unable to get domain name from ${fqdn}.`;
  }
}