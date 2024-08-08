import { Router } from 'express';
import { container } from '../../config/di-container';
import { UserController } from './UserController';
import { authenticate } from '../../infrastructure/middlewares/auth';
import { Role } from '../../core/contexts/user/constants/roles';

const router = Router();
const userController = container.resolve<UserController>('userController');

router.get('/', authenticate(Role.MANAGER), (req, res) => userController.getAll(req, res));
router.post('/sign-up', (req, res) => userController.signUp(req, res));
router.post('/sign-in', (req, res) => userController.signIn(req, res));

export default router;