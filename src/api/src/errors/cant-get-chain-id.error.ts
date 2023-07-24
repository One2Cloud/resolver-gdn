export class CantGetChainIdError extends Error {
  public readonly status = 400;
  constructor(domain: string) {
    super(domain);
    this.name = "CANT_GET_CHAIN_ID";
    this.message = `Unable to get chain ID from ${domain}.`;
  }
}