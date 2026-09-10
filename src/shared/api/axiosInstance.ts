import axios from 'axios';
import toast from 'react-hot-toast';
import { AUTH_SESSION_EXPIRED_EVENT } from '../context/AuthContext';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5041/api/v1',
  timeout: 15000, // 15 second timeout to prevent hanging requests
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

// Interceptor global para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Ocurrió un error inesperado';
    const isAuthEndpoint = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
    let shouldShowToast = true;

    if (error.response) {
      const serverDetail = error.response.data?.detail || error.response.data?.title;
      switch (error.response.status) {
        case 400:
          message = serverDetail || 'Petición inválida. Verifica los datos.';
          if (isAuthEndpoint) shouldShowToast = false;
          break;
        case 401:
          if (isAuthEndpoint) {
            shouldShowToast = false;
          } else {
            message = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
            // Dispatch event — AuthContext will handle cleanup and redirect via React Router
            window.dispatchEvent(new CustomEvent(AUTH_SESSION_EXPIRED_EVENT));
          }
          break;
        case 403:
          message = 'No tienes permisos para realizar esta acción.';
          if (isAuthEndpoint) shouldShowToast = false;
          break;
        case 404:
          message = 'Recurso no encontrado.';
          if (isAuthEndpoint) shouldShowToast = false;
          break;
        case 409:
          message = serverDetail || 'Conflicto: el registro ya existe.';
          if (isAuthEndpoint) shouldShowToast = false;
          break;
        case 422:
          message = serverDetail || 'Los datos enviados no son válidos.';
          if (isAuthEndpoint) shouldShowToast = false;
          break;
        case 429:
          message = 'Demasiadas solicitudes. Espera un momento e intenta de nuevo.';
          break;
        case 500:
          message = 'Error interno del servidor. Contacta a soporte.';
          break;
        default:
          if (error.response.status >= 500) {
            message = 'Error en el servidor. Intenta nuevamente más tarde.';
          }
          break;
      }
    } else if (error.request) {
      message = 'No hay conexión con el servidor. Revisa tu red.';
      if (isAuthEndpoint) shouldShowToast = false;
    }
    
    if (shouldShowToast) {
      toast.error(message, { id: 'global-axios-error' });
    }

    return Promise.reject(error);
  }
);
