export class CantExtractTldError extends Error {
  public readonly status = 400;
  constructor(fqdn: string) {
    super(fqdn);
    this.name = "CANT_EXTRACT_TLD";
    this.message = `Unable to extract TLD from ${fqdn}.`;
  }
}