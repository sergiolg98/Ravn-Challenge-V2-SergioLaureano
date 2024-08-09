import { UseCase, UseCaseDoubleEntry } from "../../../common/contracts/UseCase";
import { ImageRepository } from "../contracts/ImageRepository";
import { ImageEntity } from "../entities/ImageEntity";

export class UploadImagesUseCase implements UseCaseDoubleEntry<any[], number, ImageEntity[]> {
  private imageRepository: ImageRepository;

  constructor(imageRepository: ImageRepository) {
    this.imageRepository = imageRepository;
  }

  async execute(files: any[], productId: number): Promise<ImageEntity[]> {
    const images: ImageEntity[] = await this.imageRepository.upload(files, productId);
    return images;
  }
}