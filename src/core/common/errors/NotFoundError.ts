import { CustomError, CustomErrorType } from './CustomError';

export class NotFoundError extends CustomError {
  statusCode = 404;
  errorType = CustomErrorType.NotFound;

  constructor(message?: string) {
    super(message ?? 'Resource not found in application.');
  }
}
