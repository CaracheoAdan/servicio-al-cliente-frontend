import { api } from '../../../shared/api/axiosInstance';
import { ProductionOrder, CreateProductionOrderCommand, UpdateOrderStatusCommand } from '../types/order.types';

export const orderApi = {
  getOrders: async (): Promise<ProductionOrder[]> => {
    const { data } = await api.get('/productionOrders');
    return data;
  },
  
  getOrderById: async (id: string): Promise<ProductionOrder> => {
    const { data } = await api.get(`/productionOrders/${id}`);
    return data;
  },

  createOrder: async (command: CreateProductionOrderCommand): Promise<ProductionOrder> => {
    const { data } = await api.post('/productionOrders', command);
    return data;
  },

  updateStatus: async (id: string, command: UpdateOrderStatusCommand): Promise<void> => {
    await api.patch(`/productionOrders/${id}/update_status/${command.status}`, command);
  }
};
