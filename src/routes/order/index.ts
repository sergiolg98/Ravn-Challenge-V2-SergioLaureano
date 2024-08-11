import { Router } from 'express';
import { container } from '../../config/di-container';
import { OrderController } from '../../infrastructure/http/controllers/OrderController';
import { authenticate } from '../../infrastructure/http/middlewares/auth';
import { Role } from '../../core/contexts/user/constants/roles';

const router = Router();
const orderController = container.resolve<OrderController>('orderController');

// CLIENT ENDPOINTS
router.post(
  '/',
  authenticate(Role.CLIENT),
  (req, res) => orderController.create(req, res),
);

export default router;