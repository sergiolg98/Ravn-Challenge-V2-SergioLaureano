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

// PUBLIC ENDPOINTS
router.get(
  '/',
  (req, res) => productController.getAll(req, res),
);

router.get(
  '/:productId',
  (req, res) => productController.getById(req, res),
);

router.get(
  '/by-category/:categoryId',
  (req, res) => productController.getByCategoryId(req, res),
);

// MANAGER ENDPOINTS
router.post(
  '/',
  // authenticate(Role.MANAGER),
  (req, res) => productController.create(req, res),
);

router.delete(
  '/:productId',
  // authenticate(Role.MANAGER),
  (req, res) => productController.delete(req, res),
);

router.put(
  '/:productId',
  // authenticate(Role.MANAGER),
  (req, res) => productController.update(req, res),
);

router.put(
  '/disable/:productId',
  // authenticate(Role.MANAGER),
  (req, res) => productController.disable(req, res),
);

router.post(
  '/:productId/upload-images',
  // authenticate(Role.MANAGER),
  upload.array("images", 3), // max 3 images
  (req, res) => imageController.upload(req, res),
);

export default router;