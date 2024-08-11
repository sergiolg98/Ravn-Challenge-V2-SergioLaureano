export interface OrderEntity {
  createdAt: string,
  status: string,
  userId: number,
  items: OrderItemEntity[],
}

export interface OrderItemEntity {
  productId: number,
  quantity: number,
  unitPrice: number,
  price: number,
  orderId?: number,
}
