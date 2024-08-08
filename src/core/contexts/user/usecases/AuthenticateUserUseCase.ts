import { UseCase } from "../../../common/contracts/UseCase";
import { UserRepository } from "../contracts/UserRepository";
import { AuthResponse, UserCredentials } from "../entities/UserEntity";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthenticateUserUseCase implements UseCase<UserCredentials, AuthResponse> {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(credentials: UserCredentials): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user) throw new Error('User not exists for email provided.');

    const validPassword: boolean = await bcrypt.compare(credentials.password, user.password!);
    if (!validPassword) throw new Error('Invalid password.');

    const token: string = jwt.sign(
      { id: user.id! },
      process.env.APP_SECRET_KEY!,
      { expiresIn: '1h' },
    );
    return {
      user,
      token,
    };
  }
}
