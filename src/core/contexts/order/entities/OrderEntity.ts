export interface OrderEntity {
  id?: number;
  createdAt: Date;
  status: string;
  userId: number;
  items: OrderItemEntity[];
}

export interface OrderItemEntity {
  id?: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  price: number;
  orderId?: number;
}
