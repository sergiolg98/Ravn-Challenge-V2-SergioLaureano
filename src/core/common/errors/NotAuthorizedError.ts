import { CustomError, CustomErrorType } from './CustomError';

export class NotAuthorizedError extends CustomError {
  statusCode = 401;
  errorType = CustomErrorType.NotAuthorized;

  constructor(message?: string) {
    super(message ?? 'Not authorized for the resource.');
  }
}
