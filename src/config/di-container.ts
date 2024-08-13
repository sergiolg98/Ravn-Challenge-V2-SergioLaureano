import { asClass, asFunction, createContainer, InjectionMode } from 'awilix';
import { PostgresUserRepository } from '../infrastructure/repositories/postgresql/PostgresUserRepository';
import { UserController } from '../infrastructure/http/controllers/UserController';
import { RegisterUserUseCase } from '../core/contexts/user/usecases/RegisterUserUseCase';
import { AuthenticateUserUseCase } from '../core/contexts/user/usecases/AuthenticateUserUseCase';
import { PostgresProductRepository } from '../infrastructure/repositories/postgresql/PostgresProductRepository';
import { CreateProductUseCase } from '../core/contexts/product/usecases/CreateProductUseCase';
import { ProductController } from '../infrastructure/http/controllers/ProductController';
import { ImageController } from '../infrastructure/http/controllers/ImageController';
import { PostgresImageRepository } from '../infrastructure/repositories/postgresql/PostgresImageRepository';
import { UploadImagesUseCase } from '../core/contexts/product/usecases/UploadImagesUseCase';
import { DeleteProductUseCase } from '../core/contexts/product/usecases/DeleteProductUseCase';
import { DisableProductUseCase } from '../core/contexts/product/usecases/DisableProductUseCase';
import { FindAllProductsUseCase } from '../core/contexts/product/usecases/FindAllProductsUseCase';
import { FindProductByIdUseCase } from '../core/contexts/product/usecases/FindProductByIdUseCase';
import { FindProductsByCategoryIdUseCase } from '../core/contexts/product/usecases/FindProductsByCategoryIdUseCase';
import { UpdateProductUseCase } from '../core/contexts/product/usecases/UpdateProductUseCase';
import { LikeProductUseCase } from '../core/contexts/product/usecases/LikeProductUseCase';
import { AddProductToCartUseCase } from '../core/contexts/product/usecases/AddProductToCartUseCase';
import { OrderController } from '../infrastructure/http/controllers/OrderController';
import { PostgresOrderRepository } from '../infrastructure/repositories/postgresql/PostgresOrderRepository';
import { CreateOrderUseCase } from '../core/contexts/order/usecases/CreateOrderUseCase';
import { FindOrderByIdUseCase } from '../core/contexts/order/usecases/FindOrderByIdUseCase';
import { FindOrdersByUserIdUseCase } from '../core/contexts/order/usecases/FindOrdersByUserIdUseCase';
import { SignOutUserUseCase } from '../core/contexts/user/usecases/SignOutUserUseCase';
import { RedisTokenManagementRepository } from '../infrastructure/repositories/redis/RedisTokenManagementRepository';
import { PrismaClient } from '@prisma/client';

const container = createContainer({
  injectionMode: InjectionMode.CLASSIC,
});

container.register({
  prisma: asFunction(() => new PrismaClient()).singleton(),
  // User
  userController: asClass(UserController).singleton(),
  userRepository: asClass(PostgresUserRepository).singleton(),
  tokenManagementRepository: asClass(RedisTokenManagementRepository).singleton(),
  RegisterUserUseCase: asClass(RegisterUserUseCase).singleton(),
  AuthenticateUserUseCase: asClass(AuthenticateUserUseCase).singleton(),
  SignOutUserUseCase: asClass(SignOutUserUseCase).singleton(),
  // Product
  productController: asClass(ProductController).singleton(),
  productRepository: asClass(PostgresProductRepository).singleton(),
  CreateProductUseCase: asClass(CreateProductUseCase).singleton(),
  UpdateProductUseCase: asClass(UpdateProductUseCase).singleton(),
  FindAllProductsUseCase: asClass(FindAllProductsUseCase).singleton(),
  FindProductByIdUseCase: asClass(FindProductByIdUseCase).singleton(),
  FindProductsByCategoryIdUseCase: asClass(FindProductsByCategoryIdUseCase).singleton(),
  DeleteProductUseCase: asClass(DeleteProductUseCase).singleton(),
  DisableProductUseCase: asClass(DisableProductUseCase).singleton(),
  LikeProductUseCase: asClass(LikeProductUseCase).singleton(),
  AddProductToCartUseCase: asClass(AddProductToCartUseCase).singleton(),
  // Image
  imageController: asClass(ImageController).singleton(),
  imageRepository: asClass(PostgresImageRepository).singleton(),
  UploadImagesUseCase: asClass(UploadImagesUseCase).singleton(),
  // Order
  orderController: asClass(OrderController).singleton(),
  orderRepository: asClass(PostgresOrderRepository).singleton(),
  CreateOrderUseCase: asClass(CreateOrderUseCase).singleton(),
  FindOrderByIdUseCase: asClass(FindOrderByIdUseCase).singleton(),
  FindOrdersByUserIdUseCase: asClass(FindOrdersByUserIdUseCase).singleton(),
});

export { container };
