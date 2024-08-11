import { PrismaClient } from '@prisma/client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../../../config/aws';
import { InternalServerError } from '../../../core/common/errors/InternalServerError';
import { ImageEntity, UploadFile } from '../../../core/contexts/product/entities/ImageEntity';
import { ImageRepository } from '../../../core/contexts/product/contracts/ImageRepository';

export class PostgresImageRepository implements ImageRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async upload(files: UploadFile[], productId: number): Promise<ImageEntity[]> {
    const imagesUploaded: ImageEntity[] = [];
    for (const image of files) {
      const key = `products/${productId}/${Date.now()}-${image.originalname}`;

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        Body: image.buffer,
      });

      try {
        const response = await s3Client.send(command);
        console.log(' > S3 success: ', response);
      } catch (error) {
        console.error('> S3 error: ', error);
        throw new InternalServerError('Error in uploading proccess. Please try later.');
      }
      const imageUrl = `http://localhost:4566/${process.env.AWS_S3_BUCKET}/${key}`;
      const imageUploaded = await this.prisma.image.create({
        data: {
          url: imageUrl,
          productId: Number(productId),
        },
      });
      imagesUploaded.push(imageUploaded as ImageEntity);
    }
    return imagesUploaded;
  }

  async deleteByProductId(productId: number): Promise<void> {
    const imagesDeleted = await this.prisma.image.deleteMany({
      where: {
        productId: Number(productId),
      },
    });
    console.log(' > Images DB deleted: ', imagesDeleted);
    return;
  }
}
