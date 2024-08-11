import { Request, Response, NextFunction } from 'express';
import { container } from '../../../config/di-container';
import { NotAuthorizedError } from '../../../core/common/errors/NotAuthorizedError';
import { RedisTokenManagementRepository } from '../../repositories/redis/RedisTokenManagementRepository';
import { NotFoundError } from '../../../core/common/errors/NotFoundError';

export const checkTokenBlacklist = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new NotFoundError('No token was found in your request.');

  const tokenManagementRepository = container.resolve<RedisTokenManagementRepository>(
    'tokenManagementRepository',
  );

  const isTokenInBlacklist = await tokenManagementRepository.findToken(token!);
  if (isTokenInBlacklist) throw new NotAuthorizedError('Invalid session. Please sign in again.');

  next();
};
