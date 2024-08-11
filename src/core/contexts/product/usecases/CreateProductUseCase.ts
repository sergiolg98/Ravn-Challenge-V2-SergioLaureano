import { UseCase } from '../../../common/contracts/UseCase';
import { ProductRepository } from '../contracts/ProductRepository';
import { ProductEntity } from '../entities/ProductEntity';

export class CreateProductUseCase implements UseCase<ProductEntity, ProductEntity> {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(data: ProductEntity): Promise<ProductEntity> {
    const productCreated = await this.productRepository.create(data);
    return productCreated;
  }
}
