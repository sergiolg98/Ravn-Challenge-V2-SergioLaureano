import { CustomError, CustomErrorType } from './CustomError';

export class InternalServerError extends CustomError {
  statusCode = 500;
  errorType = CustomErrorType.InternalServer;

  constructor(message?: string) {
    super(message ?? 'Something happened. Please try later.');
  }
}
