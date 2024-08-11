import { UseCaseDoubleEntry } from '../../../common/contracts/UseCase';
import { Pagination, PaginationParams } from '../../../common/entities/Entity';
import { OrderRepository } from '../contracts/OrderRepository';
import { OrderEntity } from '../entities/OrderEntity';

export class FindOrdersByUserIdUseCase
  implements UseCaseDoubleEntry<number, PaginationParams, Pagination<OrderEntity>>
{
  private orderRepository: OrderRepository;

  constructor(orderRepository: OrderRepository) {
    this.orderRepository = orderRepository;
  }
  async execute(userId: number, params: PaginationParams): Promise<Pagination<OrderEntity>> {
    const orders = await this.orderRepository.findByUserId(userId, params);
    return orders;
  }
}
