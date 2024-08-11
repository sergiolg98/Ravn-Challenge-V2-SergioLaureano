import { Pagination, PaginationParams } from '../../../core/common/entities/Entity';
import { BadRequestError } from '../../../core/common/errors/BadRequestError';
import { OrderStatus } from '../../../core/contexts/order/constants/status';
import { OrderRepository } from '../../../core/contexts/order/contracts/OrderRepository';
import { OrderEntity } from '../../../core/contexts/order/entities/OrderEntity';
import { Prisma, PrismaClient } from '@prisma/client';
import { PaginationHelper } from './helpers';

export class PostgresOrderRepository implements OrderRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(userId: number): Promise<OrderEntity> {
    // All in a transaction to keep an atomic operation
    return this.prisma.$transaction(async (trx) => {
      const cartItems = await trx.cartItem.findMany({
        where: { userId: Number(userId) },
        include: { product: true },
      });
      if (cartItems.length === 0) throw new BadRequestError('User has no items in its cart.');

      // Create order
      const orderCreated = await this.createOrder(trx, userId, cartItems);
      await this.updateProductsStock(trx, cartItems);
      await this.clearCart(trx, userId);

      return orderCreated as any;
    });
  }

  async findById(orderId: number): Promise<OrderEntity> {
    const order = await this.prisma.order.findUnique({
      where: { id: Number(orderId) },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
    return order as OrderEntity;
  }

  async findByUserId(userId: number, params: PaginationParams): Promise<Pagination<OrderEntity>> {
    const limit: number = PaginationHelper.validateLimit(params.limit);
    const page: number = PaginationHelper.getPage(limit, params.page);
    const products = await this.prisma.order.findMany({
      skip: page,
      take: limit,
      include: {
        user: true,
        items: {
          include: { product: true },
        },
      },
      where: {
        userId: Number(userId),
      },
    });

    const pagination = {
      page: params.page ? params.page + 1 : 1,
      data: products,
    };
    return pagination as Pagination<OrderEntity>;
  }

  private async createOrder(
    transaction: Prisma.TransactionClient,
    userId: number,
    cartItems: any[],
  ): Promise<OrderEntity> {
    const orderCreated = await transaction.order.create({
      data: {
        createdAt: new Date(),
        userId: Number(userId),
        status: OrderStatus.PENDING,
        items: {
          create: cartItems.map((cartItem) => ({
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            unitPrice: cartItem.product.price,
            price: Number(cartItem.product.price) * Number(cartItem.quantity),
          })),
        },
      },
      include: {
        items: true,
      },
    });
    return orderCreated;
  }

  private async updateProductsStock(
    transaction: Prisma.TransactionClient,
    cartItems: any[],
  ): Promise<void> {
    const productUpdates = cartItems.map((cartItem) => {
      if (cartItem.product.stock < cartItem.quantity) {
        throw new BadRequestError(
          `Not enough stock for product "${cartItem.product.name}" with id ${cartItem.productId}.`,
        );
      }
      return transaction.product.update({
        where: { id: cartItem.productId },
        data: { stock: { decrement: cartItem.quantity } },
      });
    });
    Promise.all(productUpdates);
  }

  private async clearCart(transaction: Prisma.TransactionClient, userId: number): Promise<void> {
    await transaction.cartItem.deleteMany({
      where: { userId },
    });
  }
}
