import { PrismaClient } from '@prisma/client';
import {
  ProductEntity,
  UpdateProductEntity,
} from '../../../core/contexts/product/entities/ProductEntity';
import { ProductRepository } from '../../../core/contexts/product/contracts/ProductRepository';
import { PaginationParams, Pagination } from '../../../core/common/entities/Entity';
import { PaginationHelper } from './helpers';

export class PostgresProductRepository implements ProductRepository {
  constructor(private prisma: PrismaClient) { }

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

  async softDelete(productId: number): Promise<ProductEntity> {
    const productDeleted = await this.prisma.product.update({
      where: {
        id: Number(productId),
      },
      data: {
        deleted: true,
      }
    });
    return productDeleted as ProductEntity;
  }

  async findById(productId: number): Promise<ProductEntity | null> {
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
    return product as ProductEntity;
  }

  async checkIfDeleted(productId: number): Promise<boolean> {
    const product = await this.prisma.product.count({
      where: {
        id: Number(productId),
        deleted: true,
      },
    });
    return product > 0;
  }

  async checkIfActive(productId: number): Promise<boolean> {
    const product = await this.prisma.product.count({
      where: {
        id: Number(productId),
        active: true,
      },
    });
    return product > 0;
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
        deleted: false,
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
        deleted: false,
      },
    });

    const pagination = {
      page: params.page ? page + 1 : 1,
      data: products,
    };
    return pagination as Pagination<ProductEntity>;
  }

  async checkIfPreviousLike(productId: number, userId: number): Promise<any> {
    const previousLike = await this.prisma.like.count({
      where: {
        userId: Number(userId),
        productId: Number(productId),
      },
    });
    return previousLike > 0;
  }

  async like(productId: number, userId: number): Promise<any> {
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

  async showUserCart(userId: number): Promise<any[]> {
    const cartItems = await this.prisma.cartItem.findMany({
      where: {
        userId: userId,
      },
      include: {
        product: {
          include: {
            images: true,
            category: true,
          },
        },
      },
    });
    const products: any[] = cartItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        name: item.product.name,
        description: item.product.description,
        price: item.product.price,
        stock: item.product.stock,
        category: item.product.category.name,
        images: item.product.images.map((image) => image.url),
      },
    }));

    return products;
  }
}
