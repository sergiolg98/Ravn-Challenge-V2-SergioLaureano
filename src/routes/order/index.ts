import { Router } from 'express';
import { container } from '../../config/di-container';
import { OrderController } from '../../infrastructure/http/controllers/OrderController';
import { Role } from '../../core/contexts/user/constants/roles';
import { authenticate } from '../../infrastructure/http/middlewares/auth';
import { checkTokenBlacklist } from '../../infrastructure/http/middlewares/blacklist';

const router = Router();
const orderController = container.resolve<OrderController>('orderController');

// CLIENT ENDPOINTS
router.post(
  '/',
  authenticate(Role.CLIENT),
  checkTokenBlacklist,
  (req, res) => orderController.create(req, res),
);

router.get(
  '/:orderId',
  authenticate(Role.CLIENT),
  checkTokenBlacklist,
  (req, res) => orderController.findById(req, res),
);

// MANAGER ENDPOINTS
router.get(
  '/by-client/:userId',
  authenticate(Role.MANAGER),
  checkTokenBlacklist,
  (req, res) => orderController.findByUserId(req, res),
);

export default router;