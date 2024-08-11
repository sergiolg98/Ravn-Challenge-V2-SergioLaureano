import { UseCase } from "../../../common/contracts/UseCase";
import { OrderRepository } from "../contracts/OrderRepository";
import { OrderEntity } from "../entities/OrderEntity";

export class FindOrderByIdUseCase implements UseCase<number, OrderEntity> {
  private orderRepository: OrderRepository;

  constructor(orderRepository: OrderRepository) {
    this.orderRepository = orderRepository;
  }
  async execute(orderId: number): Promise<OrderEntity> {
    const order: OrderEntity = await this.orderRepository.findById(orderId);
    return order;
  }
}
