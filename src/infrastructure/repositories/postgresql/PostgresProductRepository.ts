import { PrismaClient } from "@prisma/client";
import { ProductEntity } from "../../../core/contexts/product/entities/ProductEntity";
import { ProductRepository } from "../../../core/contexts/product/contracts/ProductRepository";
import { PaginationParams, Pagination } from "../../../core/common/entities/Entity";
import { DEFAULT_LIMIT, MAX_LIMIT } from "./values";

export class PostgresProductRepository implements ProductRepository {
  private prisma: PrismaClient;

  constructor(){
    this.prisma = new PrismaClient();
  }
  
  async create(product: ProductEntity): Promise<ProductEntity> {
    const productCreated = await this.prisma.product.create({ data: product });
    return productCreated as ProductEntity;
  }

  async update(id: number, product: ProductEntity): Promise<ProductEntity> {
    const productCreated = await this.prisma.product.update({
      data: product,
      where: {
        id: Number(id),
      }
    });
    return productCreated as ProductEntity;
  }

  async disable(productId: number): Promise<ProductEntity> {
    const productUpdated = await this.prisma.product.update({
      where: {
        id: Number(productId),
      },
      data: {
        active: false,
      }
    });
    return productUpdated as ProductEntity;
  }

  async delete(productId: number): Promise<ProductEntity> {
    const productDeleted = await this.prisma.product.delete({
      where: {
        id: Number(productId),
      }
    });
    return productDeleted as ProductEntity;
  }

  async findById(productId: number): Promise<ProductEntity> {
    const product = await this.prisma.product.findUnique({
      where: {
        id: Number(productId),
      },
      include: {
        category: true,
        images: true,
      }
    });
    return product as ProductEntity; // @todo it's not but let's check
  }
  
  async findAll(params: PaginationParams): Promise<Pagination<ProductEntity>> {
    const limit: number = this.validateLimit(params.limit);
    const page: number = this.getPage(limit, params.page);
    const products = await this.prisma.product.findMany({
      skip: Number(page),
      take: Number(limit),
      include: {
        images: true,
      }
    });

    const pagination = {
      page: (params.page) ? (params.page + 1) : 1, // @todo mejorar
      data: products,
    }

    return pagination as Pagination<ProductEntity>;
  }
  async findByCategoryId(
    categoryId: number,
    params: PaginationParams,
  ): Promise<Pagination<ProductEntity>> {
    const limit: number = this.validateLimit(params.limit);
    const page: number = this.getPage(limit, params.page);
    const products = await this.prisma.product.findMany({
      skip: page,
      take: limit,
      include: {
        images: true,
      },
      where: {
        categoryId: Number(categoryId),
      }
    });

    const pagination = {
      page: (params.page) ? (params.page + 1) : 1, // @todo mejorar
      data: products,
    }
    return pagination as Pagination<ProductEntity>;
  }

  private validateLimit(initialLimit?: number): number {
    if(!initialLimit) return DEFAULT_LIMIT;
    return (initialLimit > 0 && initialLimit <= MAX_LIMIT) ? initialLimit : DEFAULT_LIMIT;
  }

  private getPage(limit: number, page?: number): number {
    let currentPage: number = 0;
    if(page !== null && page !== undefined) {
      currentPage = page - 1; // Si pide la pag 1 => 0*4 = 0 de skip
      currentPage = currentPage * limit;
    }
    return currentPage;
  }
}
