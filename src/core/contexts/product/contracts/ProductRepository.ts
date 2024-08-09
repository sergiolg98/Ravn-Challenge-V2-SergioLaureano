import { ProductEntity } from "../entities/ProductEntity";

export interface ProductRepository {
  create(data: ProductEntity): Promise<ProductEntity>;
  
}