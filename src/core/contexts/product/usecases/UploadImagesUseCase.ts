import { UseCaseDoubleEntry } from '../../../common/contracts/UseCase';
import { ImageRepository } from '../contracts/ImageRepository';
import { ProductRepository } from '../contracts/ProductRepository';
import { ImageEntity, UploadFile } from '../entities/ImageEntity';

export class UploadImagesUseCase
  implements UseCaseDoubleEntry<UploadFile[], number, ImageEntity[]>
{
  private imageRepository: ImageRepository;
  private productRepository: ProductRepository;

  constructor(imageRepository: ImageRepository, productRepository: ProductRepository) {
    this.imageRepository = imageRepository;
    this.productRepository = productRepository;
  }

  async execute(files: UploadFile[], productId: number): Promise<ImageEntity[]> {
    const product = await this.productRepository.findById(productId);
    const images: ImageEntity[] = await this.imageRepository.upload(files, productId);
    return images;
  }
}
