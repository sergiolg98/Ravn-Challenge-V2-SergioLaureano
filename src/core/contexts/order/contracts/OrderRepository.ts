import { Pagination, PaginationParams } from "../../../common/entities/Entity";
import { OrderEntity } from "../entities/OrderEntity";

export interface OrderRepository{
  create(userId: number): Promise<OrderEntity>;
  findById(orderId: number): Promise<OrderEntity>;
  findByUserId(userId: number, params: PaginationParams): Promise<Pagination<OrderEntity>>;
}
