import { PrismaClientMock } from '../__mocks__/prisma';
import { PostgresOrderRepository } from '../../infrastructure/repositories/postgresql/PostgresOrderRepository';
import { BadRequestError } from '../../core/common/errors/BadRequestError';
import { OrderEntity } from '../../core/contexts/order/entities/OrderEntity';
import { Pagination, PaginationParams } from '../../core/common/entities/Entity';
import { OrderStatus } from '../../core/contexts/order/constants/status';

describe('PostgresOrderRepository', () => {
  let orderRepository: PostgresOrderRepository;
  let mockPrisma: ReturnType<typeof PrismaClientMock>;

  beforeEach(() => {
    mockPrisma = new PrismaClientMock();
    orderRepository = new PostgresOrderRepository(mockPrisma as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an order successfully', async () => {
      const userId = 1;

      const cartItems = [
        {
          productId: 1,
          quantity: 2,
          product: { price: 100, stock: 10 },
        },
      ];

      const orderCreated: OrderEntity = {
        id: 1,
        userId,
        status: OrderStatus.PENDING,
        items: [
          {
            id: 1,
            productId: 1,
            quantity: 2,
            unitPrice: 100,
            price: 200,
          },
        ],
        createdAt: new Date(),
      };

      mockPrisma.$transaction.mockImplementationOnce(async (fn) => {
        return fn({
          cartItem: {
            findMany: jest.fn().mockResolvedValueOnce(cartItems),
            deleteMany: jest.fn().mockResolvedValueOnce({}),
          },
          order: {
            create: jest.fn().mockResolvedValueOnce(orderCreated),
          },
          product: {
            update: jest.fn().mockResolvedValueOnce({}),
          },
        });
      });

      const result = await orderRepository.create(userId);

      expect(result).toEqual(orderCreated);
    });

    it('should throw BadRequestError if user has no items in cart', async () => {
      const userId = 1;

      mockPrisma.$transaction.mockImplementationOnce(async (fn) => {
        return fn({
          cartItem: {
            findMany: jest.fn().mockResolvedValueOnce([]),
          },
        });
      });

      await expect(orderRepository.create(userId)).rejects.toThrow(BadRequestError);
    });
  });

  describe('findById', () => {
    it('should find an order by id', async () => {
      const orderId = 1;

      const order: OrderEntity = {
        id: orderId,
        userId: 1,
        status: OrderStatus.PENDING,
        items: [
          {
            id: 1,
            productId: 1,
            quantity: 2,
            unitPrice: 100,
            price: 200,
          },
        ],
        createdAt: new Date(),
      };

      mockPrisma.order.findUnique.mockResolvedValueOnce(order);

      const result = await orderRepository.findById(orderId);

      expect(result).toEqual(order);
      expect(mockPrisma.order.findUnique).toHaveBeenCalledWith({
        where: { id: orderId },
        include: {
          items: {
            include: { product: true },
          },
        },
      });
    });
  });

  describe('findByUserId', () => {
    it('should find orders by user id with pagination', async () => {
      const userId = 1;
      const params: PaginationParams = { limit: 10 };

      const orders: OrderEntity[] = [
        {
          id: 1,
          userId,
          status: OrderStatus.PENDING,
          items: [
            {
              id: 1,
              productId: 1,
              quantity: 2,
              unitPrice: 100,
              price: 200,
            },
          ],
          createdAt: new Date(),
        },
      ];

      const pagination: Pagination<OrderEntity> = {
        page: 1,
        data: orders,
      };

      mockPrisma.order.findMany.mockResolvedValueOnce(orders);

      const result = await orderRepository.findByUserId(userId, params);

      expect(result).toEqual(pagination);
      expect(mockPrisma.order.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        include: {
          user: true,
          items: {
            include: { product: true },
          },
        },
        where: {
          userId,
        },
      });
    });
  });

  describe('private methods', () => {
    it('should create an order in a transaction', async () => {
      const userId = 1;
      const cartItems = [
        {
          productId: 1,
          quantity: 2,
          product: { price: 100, stock: 10 },
        },
      ];

      const orderCreated: OrderEntity = {
        id: 1,
        userId,
        status: OrderStatus.PENDING,
        items: [
          {
            id: 1,
            productId: 1,
            quantity: 2,
            unitPrice: 100,
            price: 200,
          },
        ],
        createdAt: new Date(),
      };

      const transaction = {
        order: {
          create: jest.fn().mockResolvedValueOnce(orderCreated),
        },
      };

      const result = await orderRepository['createOrder'](transaction as any, userId, cartItems);

      expect(result).toEqual(orderCreated);
      expect(transaction.order.create).toHaveBeenCalledWith({
        data: {
          createdAt: expect.any(Date),
          userId,
          status: OrderStatus.PENDING,
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.product.price,
              price: item.product.price * item.quantity,
            })),
          },
        },
        include: {
          items: true,
        },
      });
    });

    it('should update product stock in a transaction', async () => {
      const cartItems = [
        {
          productId: 1,
          quantity: 2,
          product: { stock: 10, name: 'Test Product' },
        },
      ];

      const transaction = {
        product: {
          update: jest.fn().mockResolvedValueOnce({}),
        },
      };

      await orderRepository['updateProductsStock'](transaction as any, cartItems);

      expect(transaction.product.update).toHaveBeenCalledWith({
        where: { id: cartItems[0].productId },
        data: { stock: { decrement: cartItems[0].quantity } },
      });
    });

    it('should throw BadRequestError if not enough stock for product', async () => {
      const cartItems = [
        {
          productId: 1,
          quantity: 2,
          product: { stock: 1, name: 'Test Product' },
        },
      ];

      const transaction = {
        product: {
          update: jest.fn(),
        },
      };

      await expect(
        orderRepository['updateProductsStock'](transaction as any, cartItems),
      ).rejects.toThrow(BadRequestError);
    });

    it('should clear cart in a transaction', async () => {
      const userId = 1;

      const transaction = {
        cartItem: {
          deleteMany: jest.fn().mockResolvedValueOnce({}),
        },
      };

      await orderRepository['clearCart'](transaction as any, userId);

      expect(transaction.cartItem.deleteMany).toHaveBeenCalledWith({
        where: { userId },
      });
    });
  });
});
