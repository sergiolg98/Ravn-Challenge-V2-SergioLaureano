import { Router } from 'express';
import { container } from '../../config/di-container';
import { ImageController } from './ImageController';
import { ProductController } from './ProductController';
import { authenticate } from '../../infrastructure/middlewares/auth';
import { Role } from '../../core/contexts/user/constants/roles';
import multer from 'multer';

const router = Router();
const productController = container.resolve<ProductController>('productController');
const imageController = container.resolve<ImageController>('imageController');
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  '/',
  // authenticate(Role.MANAGER),
  (req, res) => productController.create(req, res),
);

router.post(
  '/:productId/upload-images',
  // authenticate(Role.MANAGER),
  upload.array("images", 3), // max 3 images
  (req, res) => imageController.upload(req, res),
)

export default router;