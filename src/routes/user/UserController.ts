import { Request, Response } from 'express';
import { GetAllUsersUseCase } from '../../core/contexts/user/usecases/GetAllUsersUseCase';
import { RegisterUserUseCase } from '../../core/contexts/user/usecases/RegisterUserUseCase';
import { AuthenticateUserUseCase } from '../../core/contexts/user/usecases/AuthenticateUserUseCase';
import { UserCredentials, UserEntity } from '../../core/contexts/user/entities/UserEntity';

export class UserController {
  constructor(
    private GetAllUsersUseCase: GetAllUsersUseCase,
    private AuthenticateUserUseCase: AuthenticateUserUseCase,
    private RegisterUserUseCase: RegisterUserUseCase,
  ) { }

  async getAll(_req: Request, res: Response): Promise<void> {
    const users: UserEntity[] = await this.GetAllUsersUseCase.execute();
    res.status(200).json(users);
  }

  async signUp(req: Request, res: Response): Promise<void> {
    const { name, email, password, role } = req.body;
    const user: UserEntity = {name, email, password, role};
    const response = await this.RegisterUserUseCase.execute(user);
    res.status(201).json(response);
  }

  async signIn(req: Request, res: Response): Promise<void> {
    const { email, password }: UserCredentials = req.body;
    const response = await this.AuthenticateUserUseCase.execute({email, password});
    res.status(200).json(response);
  }

}