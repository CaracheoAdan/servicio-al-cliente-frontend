import { api } from '../../../shared/api/axiosInstance';
import { Product, CreateProductCommand } from '../types/catalog.types';

export const catalogApi = {
  // Products
  getProducts: async (): Promise<Product[]> => {
    const { data } = await api.get('/products');
    return data;
  },
  createProduct: async (command: CreateProductCommand): Promise<Product> => {
    const { data } = await api.post('/products', command);
    return data;
  },
  updateProduct: async (id: number | string, command: any): Promise<Product> => {
    const { data } = await api.put(`/products/${id}`, command);
    return data;
  },
  deleteProduct: async (id: number | string): Promise<void> => {
    await api.delete(`/products/${id}`);
  }
};
