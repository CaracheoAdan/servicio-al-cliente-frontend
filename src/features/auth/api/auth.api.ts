import { api } from '../../../shared/api/axiosInstance';
import { LoginResponse, RegisterCommand, LoginCredentials } from '../types/auth.types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },
  register: async (command: RegisterCommand): Promise<void> => {
    await api.post('/auth/register', command);
  }
};
