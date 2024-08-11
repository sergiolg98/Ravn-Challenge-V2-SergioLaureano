import { CustomError, CustomErrorType } from './CustomError';

export class BadRequestError extends CustomError {
  statusCode = 400;
  errorType = CustomErrorType.BadRequest;

  constructor(message?: string) {
    super(message ?? 'Bad Request received. Check your request.');
  }
}
