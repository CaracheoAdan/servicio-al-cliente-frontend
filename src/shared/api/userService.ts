import { api } from './axiosInstance';
import { User, UserRole, CreateUserPayload, UpdateUserPayload, CreateRolePayload } from '../../features/users/types/user.types';

export const userService = {
  // Users
  async getUsers(): Promise<User[]> {
    const res = await api.get('/users');
    return Array.isArray(res.data) ? res.data : (res.data.items || res.data.data || []);
  },
  
  async createUser(payload: CreateUserPayload): Promise<User> {
    const res = await api.post('/auth/register', payload);
    return res.data.data || res.data;
  },

  async updateUser(id: number | string, payload: UpdateUserPayload): Promise<User> {
    const res = await api.put(`/users/${id}`, payload);
    return res.data.data || res.data;
  },

  async deleteUser(id: number | string): Promise<void> {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },

  // Roles
  async getRoles(): Promise<UserRole[]> {
    const res = await api.get('/user_roles');
    return Array.isArray(res.data) ? res.data : (res.data.items || res.data.data || []);
  },

  async createRole(payload: CreateRolePayload): Promise<UserRole> {
    const res = await api.post('/user_roles', payload);
    return res.data.data || res.data;
  },

  async updateRole(id: number | string, payload: Partial<CreateRolePayload>): Promise<UserRole> {
    const res = await api.put(`/user_roles/${id}`, payload);
    return res.data.data || res.data;
  },

  async deleteRole(id: number | string): Promise<void> {
    const res = await api.delete(`/user_roles/${id}`);
    return res.data;
  }
};
