export class MissingCoinNameError extends Error {
  public readonly status = 400;
  constructor() {
    super(`Missing coin name for lookup address in v1.`)
    this.name = "MISSING_COINNAME";
  }
}