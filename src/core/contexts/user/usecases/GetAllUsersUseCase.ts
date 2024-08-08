import { UseCase } from "../../../common/contracts/UseCase";
import { UserRepository } from "../contracts/UserRepository";
import { UserEntity } from "../entities/UserEntity";

export class GetAllUsersUseCase implements UseCase<void, UserEntity[]> {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(): Promise<UserEntity[]> {
    const users: UserEntity[] = await this.userRepository.getAll();
    return users;
  }
}
