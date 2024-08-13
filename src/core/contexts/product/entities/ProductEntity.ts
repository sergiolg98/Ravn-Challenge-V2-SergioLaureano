export interface ProductEntity {
  id?: number;
  name: string;
  description?: string;
  price: number;
  active: boolean;
  deleted?: boolean;
  stock: number;
  categoryId: number;
}

export interface UpdateProductEntity {
  name?: string;
  description?: string;
  price?: number;
  active?: boolean;
  stock?: number;
}
