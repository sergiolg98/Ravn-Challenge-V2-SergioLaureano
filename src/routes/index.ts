import { Router } from 'express';
import userRoutes from './user';
import productRoutes from './product';

const router = Router();

router.use('/user', userRoutes);
router.use('/product', productRoutes);

export default router;