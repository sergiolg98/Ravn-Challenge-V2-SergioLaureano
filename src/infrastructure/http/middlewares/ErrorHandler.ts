import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { BadRequestError } from '../../../core/common/errors/BadRequestError';
import { CustomError } from '../../../core/common/errors/CustomError';
import { InternalServerError } from '../../../core/common/errors/InternalServerError';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof CustomError) {
    console.debug(err);
    return res.status(err.statusCode).json(err.serializeErrors());
  } else if (err instanceof JsonWebTokenError) {
    console.debug(err);
    const badRequestError = new BadRequestError('Invalid token received.');
    return res.status(badRequestError.statusCode).json(badRequestError.serializeErrors());
  } else if (err instanceof TokenExpiredError) {
    console.debug(err);
    const badRequestError = new BadRequestError('Expired token received.');
    return res.status(badRequestError.statusCode).json(badRequestError.serializeErrors());
  }

  console.error('Unexpected Error: ', err);
  const internalErr = new InternalServerError();
  res.status(internalErr.statusCode).json(internalErr.serializeErrors());
}
