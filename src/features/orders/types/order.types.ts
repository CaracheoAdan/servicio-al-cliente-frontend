export type OrderStatus = 'open' | 'closed' | 'in_production' | 'in_delivery' | 'delivered' | 'in_process' | 'produced' | 'processed';

export interface Order {
  id: number;
  key: string;
  status: OrderStatus;
  detail?: OrderDetail;
  items: OrderItem[];
}

export interface OrderDetail {
  id: number;
  orderId: number;
  scheduledDeliveryDate: string; // Equivalente a scheduled_delivery_date
  shippingDate?: string; // Equivalente a shipping_date
}

export interface OrderItem {
  id?: number;
  orderId?: number;
  productId: number;
  orderedQuantity: number;
  deliveredQuantity: number;
}

export interface CreateOrderCommand {
  key: string;
  scheduledDeliveryDate: string;
  items: Array<{
    productId: number;
    orderedQuantity: number;
  }>;
}

export interface UpdateOrderStatusCommand {
  status: OrderStatus;
}
