import { Pagination, PaginationParams } from '../../../common/entities/Entity';
import { ProductEntity, UpdateProductEntity } from '../entities/ProductEntity';

export interface ProductRepository {
  create(data: ProductEntity): Promise<ProductEntity>;
  update(id: number, data: UpdateProductEntity): Promise<ProductEntity>;
  disable(productId: number): Promise<ProductEntity>;
  softDelete(productId: number): Promise<ProductEntity>;
  checkIfDeleted(productId: number): Promise<boolean>;
  checkIfActive(productId: number): Promise<boolean>;
  findById(productId: number): Promise<ProductEntity | null>;
  like(productId: number, userId: number): Promise<any>;
  checkIfPreviousLike(productId: number, userId: number): Promise<any>;
  // All lists with pagination
  findAll(params: PaginationParams): Promise<Pagination<ProductEntity>>;
  findByCategoryId(
    categoryId: number,
    params: PaginationParams,
  ): Promise<Pagination<ProductEntity>>;
  // Sell methods
  addToCart(productId: number, userId: number, quantity: number): Promise<any>;
  showUserCart(userId: number): Promise<any[]>;
}
