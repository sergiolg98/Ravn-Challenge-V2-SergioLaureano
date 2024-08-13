import { UseCase } from '../../../common/contracts/UseCase';
import { BadRequestError } from '../../../common/errors/BadRequestError';
import { NotAuthorizedError } from '../../../common/errors/NotAuthorizedError';
import { UserRepository } from '../contracts/UserRepository';
import { AuthResponse, UserCredentials } from '../entities/UserEntity';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthenticateUserUseCase implements UseCase<UserCredentials, AuthResponse> {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(credentials: UserCredentials): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user) throw new BadRequestError('User not exists for email provided.');

    const validPassword: boolean = await bcrypt.compare(credentials.password, user.password!);
    if (!validPassword) throw new NotAuthorizedError('Invalid password.');

    const token: string = jwt.sign({ id: user.id! }, process.env.APP_SECRET_KEY!, {
      expiresIn: process.env.JWT_TOKEN_DURATION_TIME!,
    });

    const authResponse = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
    return authResponse; 
  }
}
