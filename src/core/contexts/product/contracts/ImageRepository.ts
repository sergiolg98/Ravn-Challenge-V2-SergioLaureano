import { ImageEntity } from "../entities/ImageEntity";

export interface ImageRepository {
  upload(files: File[], productId: number): Promise<ImageEntity[]>;
  deleteByProductId(productId: number): Promise<void>;
}

