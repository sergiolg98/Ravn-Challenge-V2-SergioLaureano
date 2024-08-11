import { ImageEntity, UploadFile } from '../entities/ImageEntity';

export interface ImageRepository {
  upload(files: UploadFile[], productId: number): Promise<ImageEntity[]>;
  deleteByProductId(productId: number): Promise<void>;
}
