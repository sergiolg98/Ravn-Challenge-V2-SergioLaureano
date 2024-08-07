import { Router } from 'express';
import { container } from '../../config/di-container';
import { UserController } from './UserController';

const router = Router();
const userController = container.resolve<UserController>('userController');

router.get('/', (req, res) => userController.getAllUsers(req, res));

export default router;