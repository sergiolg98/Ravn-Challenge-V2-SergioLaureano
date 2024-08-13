import { PrismaClientMock } from '../__mocks__/prisma';
import { PostgresProductRepository } from '../../infrastructure/repositories/postgresql/PostgresProductRepository';
import {
  ProductEntity,
  UpdateProductEntity,
} from '../../core/contexts/product/entities/ProductEntity';
import { PrismaClient } from '@prisma/client/extension';
import { Pagination, PaginationParams } from '../../core/common/entities/Entity';
import { DEFAULT_ITEMS_PER_PAGE_LIMIT } from '../../infrastructure/repositories/postgresql/helpers';

describe('PostgresProductRepository', () => {
  let productRepository: PostgresProductRepository;
  let mockPrisma: ReturnType<typeof PrismaClientMock>;

  beforeEach(() => {
    mockPrisma = new PrismaClientMock();
    productRepository = new PostgresProductRepository(mockPrisma as PrismaClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a product', async () => {
    const product: ProductEntity = {
      id: 1,
      name: 'Test Product',
      description: 'Description',
      price: 50.0,
      active: true,
      stock: 100,
      categoryId: 1,
    };

    mockPrisma.product.create.mockResolvedValueOnce(product);

    const result = await productRepository.create(product);

    expect(result).toEqual(product);
    expect(mockPrisma.product.create).toHaveBeenCalledWith({
      data: product,
    });
  });

  it('should check if a product is active', async () => {
    const activeProduct = false;

    mockPrisma.product.count.mockResolvedValueOnce(activeProduct);
    const productMockId: number = 10;
    const result: boolean = await productRepository.checkIfActive(productMockId);

    expect(result).toEqual(activeProduct);
    expect(mockPrisma.product.count).toHaveBeenCalledWith({
      where: {
        id: productMockId,
        active: true,
      },
    });
  });

  it('should check if a product is deleted', async () => {
    const deletedProduct = true;

    mockPrisma.product.count.mockResolvedValueOnce(deletedProduct);
    const productMockId: number = 20;
    const result: boolean = await productRepository.checkIfDeleted(productMockId);

    expect(result).toEqual(deletedProduct);
    expect(mockPrisma.product.count).toHaveBeenCalledWith({
      where: {
        id: productMockId,
        deleted: true,
      },
    });
  });


  it('should update a product', async () => {
    const updatePayload: UpdateProductEntity = {
      description: 'new description',
      active: false,
    };

    const productUpdated: ProductEntity = {
      id: 1,
      name: 'Test Product',
      description: 'new description',
      price: 50.0,
      active: false,
      stock: 100,
      categoryId: 1,
    };

    mockPrisma.product.update.mockResolvedValueOnce(productUpdated);

    const result = await productRepository.update(1, updatePayload);

    expect(result).toEqual(productUpdated);
    expect(mockPrisma.product.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: updatePayload,
    });
  });

  it('should make a soft delete on a product', async () => {
    const productDeleted: ProductEntity = {
      id: 1,
      name: 'Test Product',
      description: 'Test Description',
      price: 100.0,
      active: true,
      stock: 50,
      categoryId: 1,
      deleted: true,
    };

    mockPrisma.product.update.mockResolvedValueOnce(productDeleted);

    const result = await productRepository.softDelete(1);

    expect(result).toEqual(productDeleted);
    expect(mockPrisma.product.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { deleted: true },
    });
  });

  it('should find a product by id', async () => {
    const product: ProductEntity = {
      id: 1,
      name: 'Test Product',
      description: 'Test Description',
      price: 100.0,
      active: true,
      stock: 50,
      categoryId: 1,
    };

    mockPrisma.product.findUnique.mockResolvedValueOnce(product);

    const result = await productRepository.findById(1);

    expect(result).toEqual(product);
    expect(mockPrisma.product.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: {
        category: true,
        images: true,
        _count: {
          select: { likes: true },
        },
      },
    });
  });

  it('should throw NotFoundError if product not found by id', async () => {
    mockPrisma.product.findUnique.mockResolvedValueOnce(null);
    const result = await productRepository.findById(1);
    expect(result).toEqual(null);
    expect(mockPrisma.product.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: {
        category: true,
        images: true,
        _count: {
          select: { likes: true },
        },
      },
    });
  });

  it('should disable a product', async () => {
    const product: ProductEntity = {
      id: 1,
      name: 'Test Product',
      description: 'Test Description',
      price: 100.0,
      active: false,
      stock: 50,
      categoryId: 1,
    };

    mockPrisma.product.update.mockResolvedValueOnce(product);

    const result = await productRepository.disable(1);

    expect(result).toEqual(product);
    expect(mockPrisma.product.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { active: false },
    });
  });

  describe('Finding Products', () => {
    it('should find all products with pagination 1st page and 1 item per page', async () => {
      const params: PaginationParams = { limit: 1, page: 1 };

      const mockedProducts = [
        {
          id: 1,
          name: 'Barcelona T-Shirt 24-25',
          description: 'Barcelona Home kit for 24-25 season.',
          price: 512.99,
          active: true,
          stock: 200,
          categoryId: 1,
          images: [
            {
              id: 1,
              url: 'http:.//localhost:4556/images-bucket/barca_24_25_home.pjeg',
              productId: 1,
            },
          ],
          _count: {
            likes: 230,
          },
        },
      ];

      const pagination: Pagination<ProductEntity> = {
        page: 1,
        data: mockedProducts as ProductEntity[],
      };

      mockPrisma.product.findMany.mockResolvedValueOnce(mockedProducts);

      const result = await productRepository.findAll(params);

      expect(result).toEqual(pagination);
      expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 1,
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
    });

    it('should find all products with default params pagination', async () => {
      const params: PaginationParams = {};

      const mockedProducts = [
        {
          id: 1,
          name: 'Barcelona T-Shirt 24-25',
          description: 'Barcelona Home kit for 24-25 season.',
          price: 512.99,
          active: true,
          stock: 200,
          categoryId: 1,
          images: [
            {
              id: 1,
              url: 'http:.//localhost:4556/images-bucket/barca_24_25_home.pjeg',
              productId: 1,
            },
          ],
          _count: {
            likes: 230,
          },
        },
      ];

      const pagination: Pagination<ProductEntity> = {
        page: 1,
        data: mockedProducts as ProductEntity[],
      };

      mockPrisma.product.findMany.mockResolvedValueOnce(mockedProducts);

      const result = await productRepository.findAll(params);

      expect(result).toEqual(pagination);
      expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: DEFAULT_ITEMS_PER_PAGE_LIMIT,
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
    });

    it('should find products corresponding to a given category', async () => {
      const params: PaginationParams = {};

      const mockedProducts = [
        {
          id: 1,
          name: 'Barcelona T-Shirt 24-25',
          description: 'Barcelona Home kit for 24-25 season.',
          price: 512.99,
          active: true,
          stock: 200,
          categoryId: 1,
          images: [
            {
              id: 1,
              url: 'http:.//localhost:4556/images-bucket/barca_24_25_home.pjeg',
              productId: 1,
            },
          ],
          _count: {
            likes: 230,
          },
        },
      ];

      const pagination: Pagination<ProductEntity> = {
        page: 1,
        data: mockedProducts as ProductEntity[],
      };

      mockPrisma.product.findMany.mockResolvedValueOnce(mockedProducts);

      const result = await productRepository.findByCategoryId(1, params);

      expect(result).toEqual(pagination);
      expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: DEFAULT_ITEMS_PER_PAGE_LIMIT,
        include: {
          images: true,
          _count: {
            select: { likes: true },
          },
        },
        where: {
          categoryId: 1,
          deleted: false,
        },
      });
    });
  });

  it('should like a product', async () => {
    const likeData = { userId: 1, productId: 1 };
    mockPrisma.like.findUnique.mockResolvedValueOnce(null);

    const likeCreated = { ...likeData };

    mockPrisma.like.create.mockResolvedValueOnce(likeCreated);

    const result = await productRepository.like(1, 1);

    expect(result).toEqual(likeCreated);
   
    expect(mockPrisma.like.create).toHaveBeenCalledWith({
      data: likeData,
    });
  });

  it('should return true if product already liked by user', async () => {
    const previouslyLiked = true;
    mockPrisma.like.count.mockResolvedValueOnce(true);

    const result = await productRepository.checkIfPreviousLike(1, 1);
    expect(previouslyLiked).toEqual(result);
    expect(mockPrisma.like.count).toHaveBeenCalledWith({
      where: {
        userId: 1,
        productId: 1,
      },
    });
  });

  it('should add a product to the cart', async () => {
    const cartItemData = { userId: 1, productId: 1, quantity: 2 };
    const cartItemCreated = { ...cartItemData };

    mockPrisma.cartItem.create.mockResolvedValueOnce(cartItemCreated);

    const result = await productRepository.addToCart(1, 1, 2);

    expect(result).toEqual(cartItemCreated);
    expect(mockPrisma.cartItem.create).toHaveBeenCalledWith({
      data: cartItemData,
    });
  });
});
