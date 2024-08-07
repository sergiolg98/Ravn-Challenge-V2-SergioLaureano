import { Request, Response } from 'express';
import { GetAllUsersUseCase } from '../../core/contexts/user/usecases/GetAllUsersUseCase';
import { UserEntity } from '../../core/contexts/user/entities/UserEntity';

export class UserController {
  constructor(
    private GetAllUsersUseCase: GetAllUsersUseCase,
  ) {}

  async getAllUsers(_req: Request, res: Response): Promise<void> {
    try {
      const users: UserEntity[] = await this.GetAllUsersUseCase.execute();
      res.status(201).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}