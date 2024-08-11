import { BadRequestError } from "../../../core/common/errors/BadRequestError";
import { OrderStatus } from "../../../core/contexts/order/constants/status";
import { OrderRepository } from "../../../core/contexts/order/contracts/OrderRepository";
import { OrderEntity } from "../../../core/contexts/order/entities/OrderEntity";
import { PrismaClient } from "@prisma/client";

export class PostgresOrderRepository implements OrderRepository {
  private prisma: PrismaClient;

  constructor(){
    this.prisma = new PrismaClient();
  }

  async create(userId: number): Promise<OrderEntity> {
    // All in a transaction to keep an atomic operation
    return this.prisma.$transaction(async (trx) => {
      const cartItems = await trx.cartItem.findMany({
        where: { userId: Number(userId) },
        include: { product: true }
      });
      if (cartItems.length === 0) throw new BadRequestError('User has no items in its cart.');
  
      // Create order
      const orderCreated = await trx.order.create({
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
            }))
          }
        },
        include: {
          items: true,
        }
      });
  
      // Update stock 
      const productUpdates = cartItems.map(cartItem => {
        if (cartItem.product.stock < cartItem.quantity) {
          throw new BadRequestError(`Not enough stock for product ${cartItem.productId}`);
        }
        return trx.product.update({
          where: { id: cartItem.productId },
          data: { stock: { decrement: cartItem.quantity } }
        });
      });

      Promise.all(productUpdates);
  
      // Clear cart items
      await trx.cartItem.deleteMany({
        where: { userId: Number(userId) }
      });
  
      return orderCreated as any;
    });
  }
}
