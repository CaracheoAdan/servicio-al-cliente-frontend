import { api } from './axiosInstance';

export const orderService = {
  async getAllCombinedOrders() {
    // 1. Fetch todo por separado
    const [ordersRes, detailsRes, itemsRes] = await Promise.all([
      api.get('/orders'),
      api.get('/orderDetails'),
      api.get('/order_items')
    ]);

    const orders = Array.isArray(ordersRes.data) ? ordersRes.data : (ordersRes.data.items || ordersRes.data.data || []);
    const details = Array.isArray(detailsRes.data) ? detailsRes.data : (detailsRes.data.items || detailsRes.data.data || []);
    const items = Array.isArray(itemsRes.data) ? itemsRes.data : (itemsRes.data.items || itemsRes.data.data || []);

    // 2. Combinar en memoria
    return orders.map((order: any) => {
      const orderDetail = details.find((d: any) => d.orderId === order.id || d.order_id === order.id);
      const orderItemsList = items.filter((i: any) => i.orderId === order.id || i.order_id === order.id);

      return {
        ...order,
        detail: orderDetail || {},
        items: orderItemsList
      };
    });
  },

  async getOrderById(id: string | number) {
    const combinedOrders = await this.getAllCombinedOrders();
    return combinedOrders.find((o: any) => o.id.toString() === id.toString());
  },

  async createOrder(payload: any) {
    // 1. Crear Orden base
    const orderRes = await api.post('/orders', { key: payload.key, status: payload.status });
    
    let orderId: number;
    if (typeof orderRes.data === 'number') {
      orderId = orderRes.data;
    } else {
      const order = orderRes.data.data || orderRes.data;
      orderId = order.id;
    }

    // 2. Crear Detalle
    if (payload.scheduledDeliveryDate || payload.shippingDate || payload.comments) {
      await api.post('/orderDetails', {
        orderId: orderId,
        scheduledDeliveryDate: payload.scheduledDeliveryDate ? new Date(payload.scheduledDeliveryDate).toISOString() : new Date().toISOString(),
        shippingDate: payload.shippingDate ? new Date(payload.shippingDate).toISOString() : new Date().toISOString()
      });
    }

    // 3. Crear Items
    if (payload.items && payload.items.length > 0) {
      await Promise.all(
        payload.items.map((item: any) => 
          api.post('/order_items', {
            orderId: orderId,
            productId: item.productId,
            orderedQuantity: item.orderedQuantity,
            deliveredQuantity: item.deliveredQuantity
          })
        )
      );
    }

    return orderId;
  },

  async updateOrder(id: string | number, payload: any, currentDetailId?: number, currentItemIds?: number[]) {
    // 1. Actualizar Orden base
    await api.put(`/orders/${id}`, { id: Number(id), key: payload.key, status: payload.status });

    // 2. Actualizar o Crear Detalle (para simplificar, crearemos un wrapper, si no hay detail lo creamos)
    const detailsRes = await api.get('/orderDetails');
    const details = Array.isArray(detailsRes.data) ? detailsRes.data : (detailsRes.data.items || detailsRes.data.data || []);
    const existingDetail = details.find((d: any) => d.orderId.toString() === id.toString() || d.order_id?.toString() === id.toString());

    const detailPayload = {
      orderId: Number(id),
      scheduledDeliveryDate: payload.scheduledDeliveryDate ? new Date(payload.scheduledDeliveryDate).toISOString() : new Date().toISOString(),
      shippingDate: payload.shippingDate ? new Date(payload.shippingDate).toISOString() : new Date().toISOString()
    };

    if (existingDetail) {
      await api.put(`/orderDetails/${existingDetail.id}`, { id: existingDetail.id, ...detailPayload });
    } else {
      await api.post('/orderDetails', detailPayload);
    }

    // 3. Recrear Items (eliminar existentes y crear nuevos es la forma mas segura si no tenemos tracking de IDs en UI)
    const itemsRes = await api.get('/order_items');
    const items = Array.isArray(itemsRes.data) ? itemsRes.data : (itemsRes.data.items || itemsRes.data.data || []);
    const existingItems = items.filter((i: any) => i.orderId.toString() === id.toString() || i.order_id?.toString() === id.toString());

    // Borramos los viejos
    await Promise.all(existingItems.map((i: any) => api.delete(`/order_items/${i.id}`).catch(() => {})));

    // Insertamos los nuevos
    if (payload.items && payload.items.length > 0) {
      await Promise.all(
        payload.items.map((item: any) => 
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
