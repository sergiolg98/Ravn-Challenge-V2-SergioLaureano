import { Router } from 'express';
import { container } from '../../config/di-container';
import { UserController } from '../../infrastructure/http/controllers/UserController';
import { authenticate } from '../../infrastructure/http/middlewares/auth';

const router = Router();
const userController = container.resolve<UserController>('userController');

router.post('/sign-up', (req, res) => userController.signUp(req, res));
router.post('/sign-in', (req, res) => userController.signIn(req, res));
router.post('/sign-out', authenticate('GENERAL'), (req, res) => userController.signOut(req, res));

export default router;
