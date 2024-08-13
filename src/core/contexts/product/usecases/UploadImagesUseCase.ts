import { UseCaseDoubleEntry } from '../../../common/contracts/UseCase';
import { NotFoundError } from '../../../common/errors/NotFoundError';
import { ImageRepository } from '../contracts/ImageRepository';
import { ProductRepository } from '../contracts/ProductRepository';
import { ImageEntity, UploadFile } from '../entities/ImageEntity';

export class UploadImagesUseCase
  implements UseCaseDoubleEntry<UploadFile[], number, ImageEntity[]> {
  private imageRepository: ImageRepository;
  private productRepository: ProductRepository;

  constructor(imageRepository: ImageRepository, productRepository: ProductRepository) {
    this.imageRepository = imageRepository;
    this.productRepository = productRepository;
  }

  async execute(files: UploadFile[], productId: number): Promise<ImageEntity[]> {
    const product = await this.productRepository.findById(productId);
    if (!product) throw new NotFoundError('Product not found with id provided.');

    const isDeleted = await this.productRepository.checkIfDeleted(productId);
    if (isDeleted) throw new NotFoundError(`This product has been previously deleted.`);

    const images: ImageEntity[] = await this.imageRepository.upload(files, productId);
    return images;
  }
}
