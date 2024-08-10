import { UseCaseDoubleEntry } from "../../../common/contracts/UseCase";
import { Pagination, PaginationParams } from "../../../common/entities/Entity";
import { ProductRepository } from "../contracts/ProductRepository";
import { ProductEntity } from "../entities/ProductEntity";

export class FindProductsByCategoryIdUseCase implements UseCaseDoubleEntry<number, PaginationParams, Pagination<ProductEntity>> {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(categoryId: number, params: PaginationParams): Promise<Pagination<ProductEntity>> {
    const products = this.productRepository.findByCategoryId(categoryId, params);
    return products;
  }
}
