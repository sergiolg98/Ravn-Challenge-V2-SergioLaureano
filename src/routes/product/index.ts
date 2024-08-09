import { Router } from 'express';
import { container } from '../../config/di-container';
import { ProductController } from './ProductController';
import { authenticate } from '../../infrastructure/middlewares/auth';
import { Role } from '../../core/contexts/user/constants/roles';

const router = Router();
const productController = container.resolve<ProductController>('productController');

router.post(
  '/',
//  authenticate(Role.MANAGER),
  (req, res) => productController.create(req, res),
);

export default router;