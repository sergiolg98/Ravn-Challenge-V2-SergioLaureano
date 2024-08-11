import { Request, Response } from 'express';
import { UserEntity } from '../../../core/contexts/user/entities/UserEntity';
import { CreateOrderUseCase } from '../../../core/contexts/order/usecases/CreateOrderUseCase';
import { FindOrderByIdUseCase } from '../../../core/contexts/order/usecases/FindOrderByIdUseCase';
import { FindOrdersByUserIdUseCase } from '../../../core/contexts/order/usecases/FindOrdersByUserIdUseCase';
import { PaginationParams } from '../../../core/common/entities/Entity';

export class OrderController {
  constructor(
    private CreateOrderUseCase: CreateOrderUseCase,
    private FindOrderByIdUseCase: FindOrderByIdUseCase,
    private FindOrdersByUserIdUseCase: FindOrdersByUserIdUseCase,
  ) { }

  async create(req: Request, res: Response): Promise<void> {
    const user: UserEntity = req.user!;
    const response = await this.CreateOrderUseCase.execute(user.id!);
    res.status(201).json(response);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const { orderId }: any = req.params;
    const response = await this.FindOrderByIdUseCase.execute(orderId);
    res.status(200).json(response);
  }

  async findByUserId(req: Request, res: Response): Promise<void> {
    const { userId }: any = req.params; // client Id
    const { page, limit }: any = req.query;
    const paginationPararms: PaginationParams = {
      page,
      limit,
    }
    const response = await this.FindOrdersByUserIdUseCase.execute(userId, paginationPararms);
    res.status(200).json(response);
  }
}
