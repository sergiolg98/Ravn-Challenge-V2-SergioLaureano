import { Request, Response } from 'express';
import { UserEntity, UserCredentials } from '../../../core/contexts/user/entities/UserEntity';
import { GetAllUsersUseCase } from '../../../core/contexts/user/usecases/GetAllUsersUseCase';
import { AuthenticateUserUseCase } from '../../../core/contexts/user/usecases/AuthenticateUserUseCase';
import { RegisterUserUseCase } from '../../../core/contexts/user/usecases/RegisterUserUseCase';
import { SignOutUserUseCase } from '../../../core/contexts/user/usecases/SignOutUserUseCase';

export class UserController {
  constructor(
    private GetAllUsersUseCase: GetAllUsersUseCase,
    private AuthenticateUserUseCase: AuthenticateUserUseCase,
    private RegisterUserUseCase: RegisterUserUseCase,
    private SignOutUserUseCase: SignOutUserUseCase,
  ) {}

  async getAll(_req: Request, res: Response): Promise<void> {
    const users: UserEntity[] = await this.GetAllUsersUseCase.execute();
    res.status(200).json(users);
  }

  async signUp(req: Request, res: Response): Promise<void> {
    const { name, email, password, role } = req.body;
    const user: UserEntity = { name, email, password, role };
    const response = await this.RegisterUserUseCase.execute(user);
    res.status(201).json(response);
  }

  async signIn(req: Request, res: Response): Promise<void> {
    const { email, password }: UserCredentials = req.body;
    const response = await this.AuthenticateUserUseCase.execute({ email, password });
    res.status(200).json(response);
  }

  async signOut(req: Request, res: Response): Promise<void> {
    const token = req.headers.authorization?.split(' ')[1];
    const response = await this.SignOutUserUseCase.execute(token!);
    res.status(200).json(response);
  }
}
