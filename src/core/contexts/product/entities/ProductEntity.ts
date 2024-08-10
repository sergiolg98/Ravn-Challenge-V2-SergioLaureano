export interface ProductEntity {
  id?: number,
  name: string,
  description?: string,
  price: number,
  active: boolean,
  categoryId: number,
}

export interface UpdateProductEntity {
  name?: string,
  description?: string,
  price?: number,
  active?: boolean,
}
