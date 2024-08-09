import { Request, Response } from 'express';
import { UploadImagesUseCase } from '../../core/contexts/product/usecases/UploadImagesUseCase';

export class ImageController {
  constructor(
    private UploadImagesUseCase: UploadImagesUseCase,
  ) { }

  async upload(req: Request, res: Response): Promise<void> {
    const files: any[] = req.files as Express.Multer.File[]; // @todo, a cual interfaz castearlo?
    const { productId }: any = req.params; // obtener el productId
    const response = await this.UploadImagesUseCase.execute(files, productId);
    res.status(201).json(response);
  }
}
