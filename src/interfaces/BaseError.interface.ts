export class BaseError extends Error {
  public readonly status: number;
  constructor(status: number, name: string, message: string) {
    super();
    this.status = status;
    this.name = name;
    this.message = message;
  }
}
