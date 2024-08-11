import { UseCase } from '../../../common/contracts/UseCase';
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
    await this.imageRepository.deleteByProductId(productId); // delete images related
    const disabledProduct = await this.productRepository.delete(productId);

    return disabledProduct;
  }
}
