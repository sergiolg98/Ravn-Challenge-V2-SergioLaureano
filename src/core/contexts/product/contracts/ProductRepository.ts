import { Pagination, PaginationParams } from "../../../common/entities/Entity";
import { ProductEntity, UpdateProductEntity } from "../entities/ProductEntity";

export interface ProductRepository {
  create(data: ProductEntity): Promise<ProductEntity>;
  update(id: number, data: UpdateProductEntity): Promise<ProductEntity>;
  disable(productId: number): Promise<ProductEntity>;
  delete(productId: number): Promise<ProductEntity>;
  findById(productId: number): Promise<ProductEntity>;
  // All lists with pagination
  findAll(params: PaginationParams): Promise<Pagination<ProductEntity>>;
  findByCategoryId(categoryId: number, params: PaginationParams): Promise<Pagination<ProductEntity>>;
  
}
