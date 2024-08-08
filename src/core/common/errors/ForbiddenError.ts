import { CustomError, CustomErrorType } from "./CustomError";

export class ForbiddenError extends CustomError {
  statusCode = 403
  errorType = CustomErrorType.Forbidden;

  constructor(message?: string) {
    super(message ?? "Forbidden access.");
  }
}
