const prismaMock = {
  $transaction: jest.fn(),
  product: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  like: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  cartItem: {
    create: jest.fn(),
    deleteMany: jest.fn(),
  },
  order: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  image: {
    create: jest.fn(),
    deleteMany: jest.fn(),
  },
};

export const PrismaClientMock = jest.fn(() => prismaMock);
