import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
  endpoint: 'http://localstack:4566', // internal docker endpoint
  region: process.env.AWS_REGION,
  // credentials: {
  //   accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  // },
  forcePathStyle: true,
});
