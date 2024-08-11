import { UseCase } from '../../../common/contracts/UseCase';
import { ProductRepository } from '../contracts/ProductRepository';
import { ProductEntity } from '../entities/ProductEntity';

export class FindProductByIdUseCase implements UseCase<number, ProductEntity> {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(productId: number): Promise<ProductEntity> {
    const products = this.productRepository.findById(productId);
    return products;
  }
}
