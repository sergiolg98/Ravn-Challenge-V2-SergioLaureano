import { UseCaseDoubleEntry } from '../../../common/contracts/UseCase';
import { NotFoundError } from '../../../common/errors/NotFoundError';
import { ProductRepository } from '../contracts/ProductRepository';
import { ProductEntity, UpdateProductEntity } from '../entities/ProductEntity';

export class UpdateProductUseCase
  implements UseCaseDoubleEntry<number, UpdateProductEntity, ProductEntity>
{
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(productId: number, data: UpdateProductEntity): Promise<ProductEntity> {
    const product = await this.productRepository.findById(productId);
    if(!product) throw new NotFoundError('Product not found with id provided.');

    const isDeleted = await this.productRepository.checkIfDeleted(productId);
    if(isDeleted) throw new NotFoundError(`This product has been previously deleted.`);

    const productCreated = await this.productRepository.update(productId, data);
    return productCreated;
  }
}
