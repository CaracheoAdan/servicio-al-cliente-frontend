import { api } from './axiosInstance';

// Enums y Tipos Base
export enum OrderStatus {
  NONE = 'NONE',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  IN_PRODUCTION = 'IN_PRODUCTION',
  IN_DELIVERY = 'IN_DELIVERY',
  DELIVERED = 'DELIVERED',
  IN_PROCESS = 'IN_PROCESS',
  PRODUCED = 'PRODUCED',
  PROCESSED = 'PROCESSED'
}

export interface RawOrder {
  id: number;
  key: string;
  status: OrderStatus;
}

export interface RawOrderDetail {
  id: number;
  orderId?: number;
  order_id?: number;
  scheduledDeliveryDate?: string;
  scheduled_delivery_date?: string;
  shippingDate?: string;
  shipping_date?: string;
}

export interface RawOrderItem {
  id: number;
  orderId?: number;
  order_id?: number;
  productId?: number;
  product_id?: number;
  orderedQuantity?: number;
  ordered_quantity?: number;
  deliveredQuantity?: number;
  delivered_quantity?: number;
  product?: {
    id: number;
    name: string;
  };
  product_name?: string;
}

export interface CombinedOrderItem {
  id: number;
  productId: number;
  product_id?: number;
  productName: string;
  orderedQuantity: number;
  ordered_quantity?: number;
  deliveredQuantity: number;
  delivered_quantity?: number;
}

export interface CombinedOrderDetail {
  id: number;
  scheduledDeliveryDate: string;
  scheduled_delivery_date?: string;
  shippingDate: string;
  shipping_date?: string;
  comments?: string;
}

export interface CombinedOrder {
  id: number;
  key: string;
  status: OrderStatus;
  scheduled_delivery_date?: string;
  detail: CombinedOrderDetail | null;
  items: CombinedOrderItem[];
}

export interface CreateOrderPayload {
  key: string;
  status: OrderStatus | string;
  scheduledDeliveryDate?: string;
  shippingDate?: string;
  comments?: string;
  items: Omit<CombinedOrderItem, 'id' | 'productName' | 'product_id' | 'ordered_quantity' | 'delivered_quantity'>[];
}

// ─── Helpers ─────────────────────────────────────────────────────

/** Safely converts a date string to ISO format, falling back to current date */
function toISOStringOrDefault(dateStr?: string): string {
  if (!dateStr) return new Date().toISOString();
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return new Date().toISOString();
  return d.toISOString();
}

export const orderService = {
  /**
   * Obtiene todas las ordenes, detalles e items, y los combina en objetos hidratados.
   */
  async getAllCombinedOrders(): Promise<CombinedOrder[]> {
    const [ordersRes, detailsRes, itemsRes] = await Promise.all([
      api.get('/orders'),
      api.get('/order_details'),
      api.get('/order_items')
    ]);

    const orders: RawOrder[] = Array.isArray(ordersRes.data) ? ordersRes.data : (ordersRes.data.items || ordersRes.data.data || []);
    const details: RawOrderDetail[] = Array.isArray(detailsRes.data) ? detailsRes.data : (detailsRes.data.items || detailsRes.data.data || []);
    const items: RawOrderItem[] = Array.isArray(itemsRes.data) ? itemsRes.data : (itemsRes.data.items || itemsRes.data.data || []);

    return orders.map((order) => {
      const orderDetail = details.find(d => d.orderId === order.id || d.order_id === order.id);
      const orderItemsList = items.filter(i => i.orderId === order.id || i.order_id === order.id);

      return {
        id: order.id,
        key: order.key,
        status: (order.status?.toString().toUpperCase() as OrderStatus) || OrderStatus.NONE,
        detail: orderDetail ? {
          id: orderDetail.id,
          scheduledDeliveryDate: orderDetail.scheduledDeliveryDate || orderDetail.scheduled_delivery_date || '',
          shippingDate: orderDetail.shippingDate || orderDetail.shipping_date || ''
        } : null,
        items: orderItemsList.map(i => ({
          id: i.id,
          productId: i.productId || i.product_id || 0,
          productName: i.product?.name || i.product_name || `Producto #${i.productId || i.product_id}`,
          orderedQuantity: i.orderedQuantity || i.ordered_quantity || 0,
          deliveredQuantity: i.deliveredQuantity || i.delivered_quantity || 0
        }))
      };
    });
  },

  async getOrderById(id: string | number): Promise<CombinedOrder | undefined> {
    const allOrders = await this.getAllCombinedOrders();
    return allOrders.find(o => o.id.toString() === id.toString());
  },

  async createOrder(payload: CreateOrderPayload): Promise<number> {
    const statusUpper = (payload.status || 'OPEN').toString().toUpperCase();
    const orderRes = await api.post('/orders', { key: payload.key, status: statusUpper });
    
    let orderId: number;
    if (typeof orderRes.data === 'number') {
      orderId = orderRes.data;
    } else {
      const order = orderRes.data.data || orderRes.data;
      orderId = order.id;
    }

    if (payload.scheduledDeliveryDate || payload.shippingDate) {
      await api.post('/order_details', {
        orderId,
        scheduledDeliveryDate: toISOStringOrDefault(payload.scheduledDeliveryDate),
        shippingDate: toISOStringOrDefault(payload.shippingDate)
      });
    }

    if (payload.items && payload.items.length > 0) {
      await Promise.all(
        payload.items.map(item => 
          api.post('/order_items', {
            orderId,
            productId: item.productId,
            orderedQuantity: item.orderedQuantity,
            deliveredQuantity: item.deliveredQuantity
          })
        )
      );
    }

    return orderId;
  },

  async updateOrder(id: string | number, payload: CreateOrderPayload): Promise<void> {
    const statusUpper = (payload.status || 'OPEN').toString().toUpperCase();
    // PUT sin id en el payload, solo en la URL
    await api.put(`/orders/${id}`, { key: payload.key, status: statusUpper });

    // Fetch existing detail/items for this order
    let existingDetailId: number | null = null;
    let existingItemIds: number[] = [];

    const [detailsRes, itemsRes] = await Promise.all([
      api.get('/order_details'),
      api.get('/order_items')
    ]);
    const details: RawOrderDetail[] = Array.isArray(detailsRes.data) ? detailsRes.data : (detailsRes.data.items || detailsRes.data.data || []);
    const items: RawOrderItem[] = Array.isArray(itemsRes.data) ? itemsRes.data : (itemsRes.data.items || itemsRes.data.data || []);
    const existingDetail = details.find(d => d.orderId?.toString() === id.toString() || d.order_id?.toString() === id.toString());
    existingDetailId = existingDetail?.id || null;
    existingItemIds = items.filter(i => i.orderId?.toString() === id.toString() || i.order_id?.toString() === id.toString()).map(i => i.id);

    const detailPayload = {
      orderId: Number(id),
      scheduledDeliveryDate: toISOStringOrDefault(payload.scheduledDeliveryDate),
      shippingDate: toISOStringOrDefault(payload.shippingDate)
    };

    if (existingDetailId) {
      await api.put(`/order_details/${existingDetailId}`, detailPayload);
    } else {
      await api.post('/order_details', detailPayload);
    }

    // Delete existing items with proper error reporting instead of silent catch
    const deleteResults = await Promise.allSettled(
      existingItemIds.map(itemId => api.delete(`/order_items/${itemId}`))
    );
    const failedDeletes = deleteResults.filter(r => r.status === 'rejected');
    if (failedDeletes.length > 0) {
      console.error(`Failed to delete ${failedDeletes.length} order items during update`);
    }

    if (payload.items && payload.items.length > 0) {
      await Promise.all(
        payload.items.map(item => 
          api.post('/order_items', {
            orderId: Number(id),
            productId: item.productId,
            orderedQuantity: item.orderedQuantity,
            deliveredQuantity: item.deliveredQuantity
          })
        )
      );
    }
  }
};
