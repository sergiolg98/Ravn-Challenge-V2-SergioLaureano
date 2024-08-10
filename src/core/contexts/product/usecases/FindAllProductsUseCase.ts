import { UseCase } from "../../../common/contracts/UseCase";
import { Pagination, PaginationParams } from "../../../common/entities/Entity";
import { ProductRepository } from "../contracts/ProductRepository";
import { ProductEntity } from "../entities/ProductEntity";

export class FindAllProductsUseCase implements UseCase<PaginationParams, Pagination<ProductEntity>> {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(params: PaginationParams): Promise<Pagination<ProductEntity>> {
    const products = this.productRepository.findAll(params);
    return products;
  }
}
