import { PrismaClientMock } from '../__mocks__/prisma';
import { PostgresImageRepository } from '../../infrastructure/repositories/postgresql/PostgresImageRepository';
import { s3Client } from '../../config/aws';
import { InternalServerError } from '../../core/common/errors/InternalServerError';
import { ImageEntity, UploadFile } from '../../core/contexts/product/entities/ImageEntity';

jest.mock('../../config/aws', () => ({
  s3Client: {
    send: jest.fn(),
  },
}));

describe('PostgresImageRepository', () => {
  let imageRepository: PostgresImageRepository;
  let mockPrisma: ReturnType<typeof PrismaClientMock>;

  beforeEach(() => {
    mockPrisma = new PrismaClientMock();
    imageRepository = new PostgresImageRepository(mockPrisma as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('upload', () => {
    it('should upload images and save their URLs to the database', async () => {
      const mockFiles: UploadFile[] = [
        {
          fieldname: 'image',
          originalname: 'test-image.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          buffer: Buffer.from('test-image-data'),
          size: 1024,
        },
      ];

      const mockImageEntity: ImageEntity = {
        id: 1,
        url: 'http://localhost:4566/images-bucket/products/1/mock-test-image.jpg',
        productId: 1,
      };
      mockPrisma.image.create.mockResolvedValueOnce(mockImageEntity);

      const result = await imageRepository.upload(mockFiles, 1);
      expect(result).toEqual([mockImageEntity]);
    });

    it('should throw an error if S3 upload fails', async () => {
      const mockFiles: UploadFile[] = [
        {
          fieldname: 'image',
          originalname: 'test-image.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          buffer: Buffer.from('test-image-data'),
          size: 1024,
        },
      ];

      (s3Client.send as jest.Mock).mockRejectedValueOnce(new Error('S3 error'));

      await expect(imageRepository.upload(mockFiles, 1)).rejects.toThrow(InternalServerError);
      expect(mockPrisma.image.create).not.toHaveBeenCalled();
    });
  });

  describe('deleteByProductId', () => {
    it('should delete images by product ID', async () => {
      mockPrisma.image.deleteMany.mockResolvedValueOnce({ count: 1 });

      await imageRepository.deleteByProductId(1);

      expect(mockPrisma.image.deleteMany).toHaveBeenCalledWith({
        where: { productId: 1 },
      });
    });
  });
});
