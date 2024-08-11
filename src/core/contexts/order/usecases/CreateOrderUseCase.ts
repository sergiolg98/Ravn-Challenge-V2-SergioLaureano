import { UseCase } from '../../../common/contracts/UseCase';
import { OrderRepository } from '../contracts/OrderRepository';
import { OrderEntity } from '../entities/OrderEntity';

export class CreateOrderUseCase implements UseCase<number, OrderEntity> {
  private orderRepository: OrderRepository;

  constructor(orderRepository: OrderRepository) {
    this.orderRepository = orderRepository;
  }
  async execute(userId: number): Promise<OrderEntity> {
    const order: OrderEntity = await this.orderRepository.create(userId);
    return order;
  }
}
