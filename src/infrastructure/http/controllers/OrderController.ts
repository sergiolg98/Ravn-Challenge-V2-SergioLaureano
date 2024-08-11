import { Request, Response } from 'express';
import { UserEntity } from '../../../core/contexts/user/entities/UserEntity';
import { CreateOrderUseCase } from '../../../core/contexts/order/usecases/CreateOrderUseCase';

export class OrderController {
  constructor(
    private CreateOrderUseCase: CreateOrderUseCase,
  ) { }

  async create(req: Request, res: Response): Promise<void> {
    const user: UserEntity = req.user!;
    const response = await this.CreateOrderUseCase.execute(user.id!);
    res.status(201).json(response);
  }
}
