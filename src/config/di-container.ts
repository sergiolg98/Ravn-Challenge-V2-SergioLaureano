import { asClass, createContainer, InjectionMode } from 'awilix';
import { PostgresUserRepository } from '../infrastructure/repositories/postgresql/PostgresUserRepository';
import { GetAllUsersUseCase } from '../core/contexts/user/usecases/GetAllUsersUseCase';
import { UserController } from '../routes/user/UserController';
import { RegisterUserUseCase } from '../core/contexts/user/usecases/RegisterUserUseCase';
import { AuthenticateUserUseCase } from '../core/contexts/user/usecases/AuthenticateUserUseCase';

const container = createContainer({
  injectionMode: InjectionMode.CLASSIC
});

container.register({
  userController: asClass(UserController).singleton(),
  userRepository: asClass(PostgresUserRepository).singleton(),
  GetAllUsersUseCase: asClass(GetAllUsersUseCase).singleton(),
  RegisterUserUseCase: asClass(RegisterUserUseCase).singleton(),
  AuthenticateUserUseCase: asClass(AuthenticateUserUseCase).singleton(),
});

export { container };