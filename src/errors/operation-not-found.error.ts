import { BaseError } from "../interfaces/BaseError.interface";

export class UnknownOperationError extends BaseError {
  constructor() {
    super(
      404,
      "UNKNOWN_OPERATION",
      `Your requested operation cannot be identified. Please check your requested URL.`
    );
  }
}
