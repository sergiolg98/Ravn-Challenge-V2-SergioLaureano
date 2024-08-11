export interface OrderEntity {
  createdAt: Date;
  status: string;
  userId: number;
  items: OrderItemEntity[];
}

export interface OrderItemEntity {
  productId: number;
  quantity: number;
  unitPrice: number;
  price: number;
  orderId?: number;
}
