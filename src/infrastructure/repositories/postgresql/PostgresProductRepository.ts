import { PrismaClient } from "@prisma/client";
import { ProductEntity } from "../../../core/contexts/product/entities/ProductEntity";
import { ProductRepository } from "../../../core/contexts/product/contracts/ProductRepository";

export class PostgresProductRepository implements ProductRepository {
  private prisma: PrismaClient;

  constructor(){
    this.prisma = new PrismaClient();
  }
  
  async create(product: ProductEntity): Promise<ProductEntity> {
    const productCreated = await this.prisma.product.create({ data: product });
    return productCreated as ProductEntity;
  }
}
