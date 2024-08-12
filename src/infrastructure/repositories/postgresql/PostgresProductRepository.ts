import { PrismaClient } from '@prisma/client';
import {
  ProductEntity,
  UpdateProductEntity,
} from '../../../core/contexts/product/entities/ProductEntity';
import { ProductRepository } from '../../../core/contexts/product/contracts/ProductRepository';
import { PaginationParams, Pagination } from '../../../core/common/entities/Entity';
import { BadRequestError } from '../../../core/common/errors/BadRequestError';
import { PaginationHelper } from './helpers';
import { NotFoundError } from '../../../core/common/errors/NotFoundError';

export class PostgresProductRepository implements ProductRepository {
  constructor(private prisma: PrismaClient) {}

  async create(product: ProductEntity): Promise<ProductEntity> {
    const productCreated = await this.prisma.product.create({ data: product });
    return productCreated as ProductEntity;
  }

  async update(id: number, product: UpdateProductEntity): Promise<ProductEntity> {
    const productCreated = await this.prisma.product.update({
      data: product,
      where: {
        id: Number(id),
      },
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
      },
    });
    return productUpdated as ProductEntity;
  }

  async delete(productId: number): Promise<ProductEntity> {
    const productDeleted = await this.prisma.product.delete({
      where: {
        id: Number(productId),
      },
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
        _count: {
          select: { likes: true },
        },
      },
    });
    if (!product) throw new NotFoundError(`No product found with id: ${productId}.`);
    return product as ProductEntity; // @todo it's not but let's check
  }

  async findAll(params: PaginationParams): Promise<Pagination<ProductEntity>> {
    const limit: number = PaginationHelper.validateLimit(params.limit);
    const page: number = PaginationHelper.getPage(limit, params.page);
    const products = await this.prisma.product.findMany({
      skip: Number(page),
      take: Number(limit),
      include: {
        images: true,
        _count: {
          select: { likes: true },
        },
      },
      where: {
        active: true,
      },
    });

    const pagination = {
      page: params.page ? page + 1 : 1,
      data: products,
    };

    return pagination as Pagination<ProductEntity>;
  }
  async findByCategoryId(
    categoryId: number,
    params: PaginationParams,
  ): Promise<Pagination<ProductEntity>> {
    const limit: number = PaginationHelper.validateLimit(params.limit);
    const page: number = PaginationHelper.getPage(limit, params.page);
    const products = await this.prisma.product.findMany({
      skip: page,
      take: limit,
      include: {
        images: true,
        _count: {
          select: { likes: true },
        },
      },
      where: {
        categoryId: Number(categoryId),
        active: true,
      },
    });

    const pagination = {
      page: params.page ? page + 1 : 1,
      data: products,
    };
    return pagination as Pagination<ProductEntity>;
  }

  async like(productId: number, userId: number): Promise<any> {
    const previousLike = await this.prisma.like.findUnique({
      where: {
        userId_productId: {
          userId: Number(userId),
          productId: Number(productId),
        },
      },
    });

    if (previousLike) throw new BadRequestError('Already liked product by user');

    const likeRelation = {
      userId: Number(userId),
      productId: Number(productId),
    };

    const likeCreated = await this.prisma.like.create({
      data: likeRelation,
    });

    return likeCreated as any;
  }

  addToCart(productId: number, userId: number, quantity: number): Promise<any> {
    // Create a relation
    const addedItem = this.prisma.cartItem.create({
      data: {
        productId: Number(productId),
        userId: Number(userId),
        quantity: Number(quantity),
      },
    });
    return addedItem;
  }
}
