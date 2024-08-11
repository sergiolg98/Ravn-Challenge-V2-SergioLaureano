import { UserEntity } from '../../core/contexts/user/entities/UserEntity';

declare global {
  namespace Express {
    interface Request {
      user?: UserEntity;
    }
  }
}
