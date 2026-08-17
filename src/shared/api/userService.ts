import { api } from './axiosInstance';

export const userService = {
  // Users
  async getUsers() {
    const res = await api.get('/users');
    return Array.isArray(res.data) ? res.data : (res.data.items || res.data.data || []);
  },
  
  async getUserById(id: number | string) {
    const res = await api.get(`/users/${id}`);
    return res.data.data || res.data;
  },

  async createUser(payload: any) {
    const res = await api.post('/users', payload);
    return res.data.data || res.data;
  },

  async updateUser(id: number | string, payload: any) {
    const res = await api.put(`/users/${id}`, payload);
    return res.data.data || res.data;
  },

  async deleteUser(id: number | string) {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },

  // Roles
  async getRoles() {
    const res = await api.get('/user_roles');
    return Array.isArray(res.data) ? res.data : (res.data.items || res.data.data || []);
  },

  async createRole(payload: any) {
    const res = await api.post('/user_roles', payload);
    return res.data.data || res.data;
  },

  async updateRole(id: number | string, payload: any) {
    const res = await api.put(`/user_roles/${id}`, payload);
    return res.data.data || res.data;
  },

  async deleteRole(id: number | string) {
    const res = await api.delete(`/user_roles/${id}`);
    return res.data;
  }
};
