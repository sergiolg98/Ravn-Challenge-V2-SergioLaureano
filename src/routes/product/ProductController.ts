import { Request, Response } from 'express';
import { CreateProductUseCase } from '../../core/contexts/product/usecases/CreateProductUseCase';
import { ProductEntity } from '../../core/contexts/product/entities/ProductEntity';

export class ProductController {
  constructor(
    private CreateProductUseCase: CreateProductUseCase,
  ) { }

  async create(req: Request, res: Response): Promise<void> {
    const {
      name,
      description,
      price,
      active,
      categoryId,
    } = req.body;
    const product: ProductEntity = { name, description, price, active, categoryId };
    const response = await this.CreateProductUseCase.execute(product);
    res.status(201).json(response);
  }
}
