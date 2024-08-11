import { UseCase } from '../../../common/contracts/UseCase';
import { BadRequestError } from '../../../common/errors/BadRequestError';
import { UserRepository } from '../contracts/UserRepository';
import { UserEntity } from '../entities/UserEntity';
import bcrypt from 'bcrypt';

export class RegisterUserUseCase implements UseCase<UserEntity, UserEntity> {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(data: UserEntity): Promise<UserEntity> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestError('User already exists');
    }

    const hashed = await bcrypt.hash(data.password!, 10);
    const user: UserEntity = {
      name: data.name,
      email: data.email,
      password: hashed,
      role: data.role,
    };
    return this.userRepository.create(user);
  }
}
