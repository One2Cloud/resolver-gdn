export class InvalidFqdnError extends Error {
  public readonly status = 400;
  constructor(fqdn: string) {
    super(fqdn);
    this.name = "INVALID_FQDN";
    this.message = `Invalid FQDN: [${fqdn}]`;
  }
}
