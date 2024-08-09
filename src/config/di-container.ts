import { asClass, createContainer, InjectionMode } from 'awilix';
import { PostgresUserRepository } from '../infrastructure/repositories/postgresql/PostgresUserRepository';
import { GetAllUsersUseCase } from '../core/contexts/user/usecases/GetAllUsersUseCase';
import { UserController } from '../routes/user/UserController';
import { RegisterUserUseCase } from '../core/contexts/user/usecases/RegisterUserUseCase';
import { AuthenticateUserUseCase } from '../core/contexts/user/usecases/AuthenticateUserUseCase';
import { PostgresProductRepository } from '../infrastructure/repositories/postgresql/PostgresProductRepository';
import { CreateProductUseCase } from '../core/contexts/product/usecases/CreateProductUseCase';
import { ProductController } from '../routes/product/ProductController';
import { ImageController } from '../routes/product/ImageController';
import { PostgresImageRepository } from '../infrastructure/repositories/postgresql/PostgresImageRepository';
import { UploadImagesUseCase } from '../core/contexts/product/usecases/UploadImagesUseCase';

const container = createContainer({
  injectionMode: InjectionMode.CLASSIC
});

container.register({
  // User
  userController: asClass(UserController).singleton(),
  userRepository: asClass(PostgresUserRepository).singleton(),
  GetAllUsersUseCase: asClass(GetAllUsersUseCase).singleton(),
  RegisterUserUseCase: asClass(RegisterUserUseCase).singleton(),
  AuthenticateUserUseCase: asClass(AuthenticateUserUseCase).singleton(),
  // Product
  productController: asClass(ProductController).singleton(),
  productRepository: asClass(PostgresProductRepository).singleton(),
  CreateProductUseCase: asClass(CreateProductUseCase).singleton(),
  // Image
  imageController: asClass(ImageController).singleton(),
  imageRepository: asClass(PostgresImageRepository).singleton(),
  UploadImagesUseCase: asClass(UploadImagesUseCase).singleton(),
});

export { container };