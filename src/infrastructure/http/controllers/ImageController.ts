import { Request, Response } from 'express';
import { UploadImagesUseCase } from '../../../core/contexts/product/usecases/UploadImagesUseCase';
import { UploadFile } from '../../../core/contexts/product/entities/ImageEntity';

export class ImageController {
  constructor(private UploadImagesUseCase: UploadImagesUseCase) {}

  async upload(req: Request, res: Response): Promise<void> {
    const files = req.files as Express.Multer.File[];
    const uploadFiles: UploadFile[] = files.map((file) => ({
      fieldname: file.fieldname,
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      buffer: file.buffer,
      size: file.size,
    }));

    const { productId }: any = req.params; // obtener el productId
    const response = await this.UploadImagesUseCase.execute(uploadFiles, productId);
    res.status(201).json(response);
  }
}
