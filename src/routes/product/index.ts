import { Router } from 'express';
import { container } from '../../config/di-container';
import { ImageController } from '../../infrastructure/http/controllers/ImageController';
import { ProductController } from '../../infrastructure/http/controllers/ProductController';
import { authenticate } from '../../infrastructure/http/middlewares/auth';
import { uploadMiddleware } from '../../infrastructure/http/middlewares/multer';
import { Role } from '../../core/contexts/user/constants/roles';

const router = Router();
const productController = container.resolve<ProductController>('productController');
const imageController = container.resolve<ImageController>('imageController');

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
  uploadMiddleware.array("images", 3), // max 3 images
  (req, res) => imageController.upload(req, res),
);

// CLIENT ONLY ENDPOINTS
router.post(
  '/like/:productId',
  authenticate(Role.CLIENT),
  (req, res) => productController.like(req, res),
);

router.post(
  '/:productId/add-to-cart',
  authenticate(Role.CLIENT),
  (req, res) => productController.addToCart(req, res),
);

export default router;