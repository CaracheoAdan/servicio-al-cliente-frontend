import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5040/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar el token JWT en cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('totebin_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
