import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5041/api/v1',
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
    // Only import toast dynamically if we want to avoid circular deps or just statically if possible,
    // but axiosInstance is pure so we can statically import toast.
    // wait, we can't import toast directly here if it causes a circular dependency, but usually it doesn't.
    // Let's import it at the top.
    
    let message = 'Ocurrió un error inesperado';
    const isLoginEndpoint = error.config?.url?.includes('/auth/login');
    let shouldShowToast = true;

    if (error.response) {
      switch (error.response.status) {
        case 400:
          message = 'Petición inválida. Verifica los datos.';
          if (isLoginEndpoint) shouldShowToast = false; // Manejado en LoginPage
          break;
        case 401:
          if (isLoginEndpoint) {
            shouldShowToast = false; // Manejado en LoginPage
          } else {
            message = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
            localStorage.removeItem('totebin_token');
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
          }
          break;
        case 403:
          message = 'No tienes permisos para realizar esta acción.';
          if (isLoginEndpoint) shouldShowToast = false;
          break;
        case 404:
          message = 'Recurso no encontrado.';
          if (isLoginEndpoint) shouldShowToast = false;
          break;
        case 500:
          message = 'Error interno del servidor. Contacta a soporte.';
          break;
      }
    } else if (error.request) {
      message = 'No hay conexión con el servidor. Revisa tu red.';
      if (isLoginEndpoint) shouldShowToast = false;
    }
    
    // We import toast dynamically to avoid breaking tests or pure Node contexts
    if (shouldShowToast) {
      import('react-hot-toast').then(({ toast }) => {
        toast.error(message, { id: 'global-axios-error' }); // Use id to prevent duplicate toasts
      });
    }

    return Promise.reject(error);
  }
);
