import { UseCaseDoubleEntry } from "../../../common/contracts/UseCase";
import { ImageRepository } from "../contracts/ImageRepository";
import { ImageEntity, UploadFile } from "../entities/ImageEntity";

export class UploadImagesUseCase implements UseCaseDoubleEntry<UploadFile[], number, ImageEntity[]> {
  private imageRepository: ImageRepository;

  constructor(imageRepository: ImageRepository) {
    this.imageRepository = imageRepository;
  }

  async execute(files: UploadFile[], productId: number): Promise<ImageEntity[]> {
    const images: ImageEntity[] = await this.imageRepository.upload(files, productId);
    return images;
  }
}