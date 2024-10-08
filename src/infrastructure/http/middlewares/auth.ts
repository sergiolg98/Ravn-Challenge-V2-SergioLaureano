import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { container } from '../../../config/di-container';
import { ForbiddenError } from '../../../core/common/errors/ForbiddenError';
import { NotAuthorizedError } from '../../../core/common/errors/NotAuthorizedError';
import { NotFoundError } from '../../../core/common/errors/NotFoundError';
import { Role } from '../../../core/contexts/user/constants/roles';
import { PostgresUserRepository } from '../../repositories/postgresql/PostgresUserRepository';

export const authenticate =
  (role?: Role.CLIENT | Role.MANAGER | 'GENERAL') =>
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) throw new NotFoundError('No token was found in your request.');

    const decoded: any = verify(token, process.env.APP_SECRET_KEY!);
    const userRepository = container.resolve<PostgresUserRepository>('userRepository');
    const user = await userRepository.findById(decoded.id);
    if (!user) throw new NotAuthorizedError('You are not authorized to this request.');

    if (role === 'GENERAL' || role === user.role) {
      req.user = user; // Send user
      next();
    } else {
      // Role verification - Manager can access everything, Client only client
      // if (user.role !== Role.MANAGER)
      throw new ForbiddenError('Access forbidden.');
    }
  };
