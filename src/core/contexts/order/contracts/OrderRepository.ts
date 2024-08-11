import { ProductEntity } from "../../product/entities/ProductEntity";
import { OrderEntity } from "../entities/OrderEntity";

export interface OrderRepository{
  create(userId: number): Promise<OrderEntity>;
}
