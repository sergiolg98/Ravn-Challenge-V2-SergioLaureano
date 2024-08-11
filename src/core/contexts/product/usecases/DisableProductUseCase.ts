import { UseCase } from '../../../common/contracts/UseCase';
import { ProductRepository } from '../contracts/ProductRepository';
import { ProductEntity } from '../entities/ProductEntity';

export class DisableProductUseCase implements UseCase<number, ProductEntity> {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(productId: number): Promise<ProductEntity> {
    const disabledProduct = await this.productRepository.disable(productId);
    return disabledProduct;
  }
}
