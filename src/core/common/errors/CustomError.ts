export enum CustomErrorType {
  InternalServer = "INTERNAL_SERVER_ERROR",
  NotFound = "NOT_FOUND_ERROR",
  NotAuthorized = "NOT_AUTHORIZED_ERROR",
  Forbidden = "FORBIDDEN_ERROR",
  BadRequest = "BAD_REQUEST_ERROR",
}

export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract errorType: CustomErrorType;
  constructor(message: string) {
    super(message);
  }

  serializeErrors(): { status: number, errorType: CustomErrorType, message: string } {
    const errorObject = {
      status: this.statusCode,
      errorType: this.errorType,
      message: this.message,
    };
    return errorObject;
  }
}
