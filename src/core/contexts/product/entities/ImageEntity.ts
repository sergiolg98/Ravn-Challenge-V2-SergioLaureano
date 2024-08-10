export interface ImageEntity {
  id?: number,
  url: string,
  productId: number,
}

export interface UploadFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}
