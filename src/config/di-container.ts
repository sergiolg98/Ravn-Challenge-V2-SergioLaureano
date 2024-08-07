import { asClass, createContainer, InjectionMode } from 'awilix';
import { PostgresUserRepository } from '../infrastructure/repositories/postgresql/PostgresUserRepository';
import { GetAllUsersUseCase } from '../core/contexts/user/usecases/GetAllUsersUseCase';
import { UserController } from '../routes/user/UserController';

const container = createContainer({
  injectionMode: InjectionMode.CLASSIC
});

container.register({
  userRepository: asClass(PostgresUserRepository).singleton(),
  GetAllUsersUseCase: asClass(GetAllUsersUseCase).singleton(),
  userController: asClass(UserController).singleton(),
});

export { container };