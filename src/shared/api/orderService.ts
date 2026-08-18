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
  productName: string;
  orderedQuantity: number;
  deliveredQuantity: number;
}

export interface CombinedOrderDetail {
  id: number;
  scheduledDeliveryDate: string;
  shippingDate: string;
}

export interface CombinedOrder {
  id: number;
  key: string;
  status: OrderStatus;
  detail: CombinedOrderDetail | null;
  items: CombinedOrderItem[];
}

export interface CreateOrderPayload {
  key: string;
  status: OrderStatus;
  scheduledDeliveryDate?: string;
  shippingDate?: string;
  items: Omit<CombinedOrderItem, 'id' | 'productName'>[];
}

// Simple in-memory cache to avoid redundant API calls
let _ordersCache: CombinedOrder[] | null = null;
let _ordersCacheTime: number = 0;
const CACHE_TTL = 30000; // 30 seconds

function invalidateOrdersCache() {
  _ordersCache = null;
  _ordersCacheTime = 0;
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

    const result = orders.map((order) => {
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

    _ordersCache = result;
    _ordersCacheTime = Date.now();
    return result;
  },

  async getOrderById(id: string | number): Promise<CombinedOrder | undefined> {
    // Use cache if fresh
    if (_ordersCache && (Date.now() - _ordersCacheTime) < CACHE_TTL) {
      return _ordersCache.find(o => o.id.toString() === id.toString());
    }
    // Otherwise fetch all and cache
    const allOrders = await this.getAllCombinedOrders();
    return allOrders.find(o => o.id.toString() === id.toString());
  },

  async createOrder(payload: CreateOrderPayload): Promise<number> {
    const statusUpper = payload.status.toUpperCase();
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
        scheduledDeliveryDate: payload.scheduledDeliveryDate ? new Date(payload.scheduledDeliveryDate).toISOString() : new Date().toISOString(),
        shippingDate: payload.shippingDate ? new Date(payload.shippingDate).toISOString() : new Date().toISOString()
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

    invalidateOrdersCache();
    return orderId;
  },

  async updateOrder(id: string | number, payload: CreateOrderPayload): Promise<void> {
    const statusUpper = payload.status.toUpperCase();
    // PUT sin id en el payload, solo en la URL
    await api.put(`/orders/${id}`, { key: payload.key, status: statusUpper });

    // Use cache if available to find existing detail/items, otherwise fetch
    let existingDetailId: number | null = null;
    let existingItemIds: number[] = [];

    if (_ordersCache) {
      const cached = _ordersCache.find(o => o.id.toString() === id.toString());
      if (cached) {
        existingDetailId = cached.detail?.id || null;
        existingItemIds = cached.items.map(i => i.id);
      }
    }

    if (existingDetailId === null && existingItemIds.length === 0) {
      // Fallback: fetch from API
      const [detailsRes, itemsRes] = await Promise.all([
        api.get('/order_details'),
        api.get('/order_items')
      ]);
      const details: RawOrderDetail[] = Array.isArray(detailsRes.data) ? detailsRes.data : (detailsRes.data.items || detailsRes.data.data || []);
      const items: RawOrderItem[] = Array.isArray(itemsRes.data) ? itemsRes.data : (itemsRes.data.items || itemsRes.data.data || []);
      const existingDetail = details.find(d => d.orderId?.toString() === id.toString() || d.order_id?.toString() === id.toString());
      existingDetailId = existingDetail?.id || null;
      existingItemIds = items.filter(i => i.orderId?.toString() === id.toString() || i.order_id?.toString() === id.toString()).map(i => i.id);
    }

    const detailPayload = {
      orderId: Number(id),
      scheduledDeliveryDate: payload.scheduledDeliveryDate ? new Date(payload.scheduledDeliveryDate).toISOString() : new Date().toISOString(),
      shippingDate: payload.shippingDate ? new Date(payload.shippingDate).toISOString() : new Date().toISOString()
    };

    if (existingDetailId) {
      await api.put(`/order_details/${existingDetailId}`, detailPayload);
    } else {
      await api.post('/order_details', detailPayload);
    }

    await Promise.all(existingItemIds.map(itemId => api.delete(`/order_items/${itemId}`).catch(() => {})));

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

    invalidateOrdersCache();
  }
};
