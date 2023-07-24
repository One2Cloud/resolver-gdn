export class MissingChainIdError extends Error {
  public readonly status = 400;
  constructor() {
    super();
    this.name = "MISSING_CHAIN_ID";
    this.message = `Missing chain ID for query reversed address record.`;
  }
}