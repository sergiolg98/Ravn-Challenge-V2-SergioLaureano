import { Request, Response } from 'express';
import { CreateProductUseCase } from '../../core/contexts/product/usecases/CreateProductUseCase';
import { ProductEntity, UpdateProductEntity } from '../../core/contexts/product/entities/ProductEntity';
import { DeleteProductUseCase } from '../../core/contexts/product/usecases/DeleteProductUseCase';
import { DisableProductUseCase } from '../../core/contexts/product/usecases/DisableProductUseCase';
import { FindAllProductsUseCase } from '../../core/contexts/product/usecases/FindAllProductsUseCase';
import { FindProductByIdUseCase } from '../../core/contexts/product/usecases/FindProductByIdUseCase';
import { FindProductsByCategoryIdUseCase } from '../../core/contexts/product/usecases/FindProductsByCategoryIdUseCase';
import { PaginationParams } from '../../core/common/entities/Entity';
import { UpdateProductUseCase } from '../../core/contexts/product/usecases/UpdateProductUseCase';

export class ProductController {
  constructor(
    private CreateProductUseCase: CreateProductUseCase,
    private UpdateProductUseCase: UpdateProductUseCase,
    private FindAllProductsUseCase: FindAllProductsUseCase,
    private FindProductByIdUseCase: FindProductByIdUseCase,
    private FindProductsByCategoryIdUseCase: FindProductsByCategoryIdUseCase,
    private DeleteProductUseCase: DeleteProductUseCase,
    private DisableProductUseCase: DisableProductUseCase,
  ) { }

  async create(req: Request, res: Response): Promise<void> {
    const {
      name,
      description,
      price,
      active,
      stock,
      categoryId,
    } = req.body;
    const product: ProductEntity = { name, description, price, active, stock, categoryId };
    const response = await this.CreateProductUseCase.execute(product);
    res.status(201).json(response);
  }

  async update(req: Request, res: Response): Promise<void> {
    const {
      name,
      description,
      price,
      active,
      stock,
    } = req.body;

    const product: UpdateProductEntity = {
      name,
      description,
      price,
      active,
      stock,
    };
    const { productId }: any = req.params;
    const response = await this.UpdateProductUseCase.execute(productId, product);
    res.status(200).json(response);
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const { page, limit }: any = req.query;
    const paginationPararms: PaginationParams = {
      page,
      limit,
    }
    const response = await this.FindAllProductsUseCase.execute(paginationPararms);
    res.status(200).json(response);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { productId }: any = req.params;
    const response = await this.FindProductByIdUseCase.execute(productId);
    res.status(200).json(response);
  }

  async getByCategoryId(req: Request, res: Response): Promise<void> {
    const { page, limit }: any = req.query;
    const { categoryId }: any = req.params;

    const paginationPararms: PaginationParams = {
      page,
      limit,
    }
    const response = await this.FindProductsByCategoryIdUseCase.execute(categoryId, paginationPararms);
    res.status(200).json(response);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { productId }: any = req.params;
    const response = await this.DeleteProductUseCase.execute(productId);
    res.status(200).json(response);
  }

  async disable(req: Request, res: Response): Promise<void> {
    const { productId }: any = req.params;
    const response = await this.DisableProductUseCase.execute(productId);
    res.status(200).json(response);
  }
}
