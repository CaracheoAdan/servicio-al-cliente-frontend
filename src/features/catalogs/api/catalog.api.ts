import { api } from '../../../shared/api/axiosInstance';
import { Product, CreateProductCommand, Machine, CreateMachineCommand, Responsable, CreateResponsableCommand } from '../types/catalog.types';

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
  // Machines
  getMachines: async (): Promise<Machine[]> => {
    const { data } = await api.get('/machines');
    return data;
  },
  createMachine: async (command: CreateMachineCommand): Promise<Machine> => {
    const { data } = await api.post('/machines', command);
    return data;
  },
  // Responsables
  getResponsables: async (): Promise<Responsable[]> => {
    const { data } = await api.get('/responsables');
    return data;
  },
  createResponsable: async (command: CreateResponsableCommand): Promise<Responsable> => {
    const { data } = await api.post('/responsables', command);
    return data;
  }
};
