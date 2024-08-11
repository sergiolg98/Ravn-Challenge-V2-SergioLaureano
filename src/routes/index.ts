import { Router } from 'express';
import userRoutes from './user';
import productRoutes from './product';
import orderRoutes from './order';

const router = Router();

router.use('/user', userRoutes);
router.use('/product', productRoutes);
router.use('/order', orderRoutes);

export default router;