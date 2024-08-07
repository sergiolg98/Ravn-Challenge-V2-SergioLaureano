import { UserRepository } from "../../../core/contexts/user/contracts/UserRepository";
import { UserEntity } from "../../../core/contexts/user/entities/UserEntity";
import { Role } from "../../../core/contexts/user/constants/roles";

export class PostgresUserRepository implements UserRepository {
  async getAll(): Promise<UserEntity[]> {
    const mockUsers: UserEntity[] = [{
      id: 1,
      name: 'Sergio Laureano',
      email: 'slaureang@gmail.com',
      role: Role.MANAGER,
    }];
    return mockUsers;
  }
}

