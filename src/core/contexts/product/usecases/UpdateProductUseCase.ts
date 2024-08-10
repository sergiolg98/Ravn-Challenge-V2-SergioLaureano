import { UseCaseDoubleEntry } from "../../../common/contracts/UseCase";
import { ProductRepository } from "../contracts/ProductRepository";
import { ProductEntity, UpdateProductEntity } from "../entities/ProductEntity";

export class UpdateProductUseCase implements UseCaseDoubleEntry<number, UpdateProductEntity, ProductEntity> {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(productId: number, data: UpdateProductEntity): Promise<ProductEntity> {
    const productCreated = await this.productRepository.update(productId, data);
    return productCreated;
  }
}