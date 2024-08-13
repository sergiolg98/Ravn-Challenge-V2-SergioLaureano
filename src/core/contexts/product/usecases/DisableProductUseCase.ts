import { UseCase } from '../../../common/contracts/UseCase';
import { NotFoundError } from '../../../common/errors/NotFoundError';
import { ProductRepository } from '../contracts/ProductRepository';
import { ProductEntity } from '../entities/ProductEntity';

export class DisableProductUseCase implements UseCase<number, ProductEntity> {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(productId: number): Promise<ProductEntity> {
    const product = await this.productRepository.findById(productId);
    if (!product) throw new NotFoundError('Product not found with id provided.');

    const isDeleted = await this.productRepository.checkIfDeleted(productId);
    if (isDeleted) throw new NotFoundError(`This product has been previously deleted.`);

    const disabledProduct = await this.productRepository.disable(productId);
    return disabledProduct;
  }
}
