import { Router } from 'express';
import { container } from '../../config/di-container';
import { UserController } from '../../infrastructure/http/controllers/UserController';
import { Role } from '../../core/contexts/user/constants/roles';
import { authenticate } from '../../infrastructure/http/middlewares/auth';
import { checkTokenBlacklist } from '../../infrastructure/http/middlewares/blacklist';

const router = Router();
const userController = container.resolve<UserController>('userController');

router.get(
  '/',
  authenticate(Role.MANAGER),
  checkTokenBlacklist,
  (req, res) => userController.getAll(req, res),
);
router.post('/sign-up', (req, res) => userController.signUp(req, res));
router.post('/sign-in', (req, res) => userController.signIn(req, res));

router.post(
  '/sign-out',
  authenticate('GENERAL'),
  (req, res) => userController.signOut(req, res),
);

export default router;