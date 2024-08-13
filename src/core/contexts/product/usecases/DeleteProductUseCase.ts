import { UseCase } from '../../../common/contracts/UseCase';
import { NotFoundError } from '../../../common/errors/NotFoundError';
import { ImageRepository } from '../contracts/ImageRepository';
import { ProductRepository } from '../contracts/ProductRepository';
import { ProductEntity } from '../entities/ProductEntity';

export class DeleteProductUseCase implements UseCase<number, ProductEntity> {
  private productRepository: ProductRepository;

  private imageRepository: ImageRepository;

  constructor(productRepository: ProductRepository, imageRepository: ImageRepository) {
    this.productRepository = productRepository;
    this.imageRepository = imageRepository;
  }

  async execute(productId: number): Promise<ProductEntity> {
    const product = await this.productRepository.findById(productId);
    if (!product) throw new NotFoundError('Product not found with id provided.');

    const isDeleted = await this.productRepository.checkIfDeleted(productId);
    if (isDeleted) throw new NotFoundError(`This product has been previously deleted.`);

    const deletedProduct = await this.productRepository.softDelete(productId);
    return deletedProduct;
  }
}
