import { PrismaClientMock } from '../__mocks__/prisma';
import { PostgresUserRepository } from '../../infrastructure/repositories/postgresql/PostgresUserRepository';
import { UserEntity } from '../../core/contexts/user/entities/UserEntity';
import { Role } from '../../core/contexts/user/constants/roles';

describe('PostgresUserRepository', () => {
  let userRepository: PostgresUserRepository;
  let mockPrisma: ReturnType<typeof PrismaClientMock>;

  beforeEach(() => {
    mockPrisma = new PrismaClientMock();
    userRepository = new PostgresUserRepository(mockPrisma as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const mockUser: UserEntity = {
        name: 'Sergio Laureano',
        email: 'slaureang@arequipasports.com',
        password: 'hashed_123456789',
        role: Role.MANAGER,
      };

      mockPrisma.user.create.mockResolvedValueOnce(mockUser);

      const result = await userRepository.create(mockUser);

      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          name: mockUser.name,
          email: mockUser.email,
          password: mockUser.password,
          role: mockUser.role,
        },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findById', () => {
    it('should return a user by ID', async () => {
      const mockUser: UserEntity = {
        id: 1,
        name: 'Sergio Laureano',
        email: 'slaureang@arequipasports.com',
        password: 'hashed_123456789',
        role: Role.MANAGER,
      };

      mockPrisma.user.findUnique.mockResolvedValueOnce(mockUser);

      const result = await userRepository.findById(1);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);

      const result = await userRepository.findById(1);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const mockUser: UserEntity = {
        id: 1,
        name: 'Sergio Laureano',
        email: 'slaureang@arequipasports.com',
        password: 'hashed_123456789',
        role: Role.MANAGER,
      };

      mockPrisma.user.findUnique.mockResolvedValueOnce(mockUser);

      const result = await userRepository.findByEmail('slaureang@arequipasports.com');

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'slaureang@arequipasports.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);

      const result = await userRepository.findByEmail('desconocido@arequipasports.com');

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'desconocido@arequipasports.com' },
      });
      expect(result).toBeNull();
    });
  });
});
