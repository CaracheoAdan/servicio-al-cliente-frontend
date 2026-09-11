/**
 * @fileoverview Configuración del cliente API con interceptor para tokens JWT y manejo de errores.
 * Define la instancia de Axios y utilidades para resolver la URL base dinámicamente.
 *
 * API base URL (VITE_API_URL), mismo patrón que Totebin-monitor-produc y el portal frontend:
 * - Dev (Vite proxy): `/api/v1` → vite.config proxies a localhost:5041
 * - IIS without ARR: `same-host` o ruta relativa en builds de producción
 *   resuelve a `http(s)://<browser-hostname>:5041/api/v1` para evitar IIS 404.4.
 * - Explícito absoluto: `http://192.168.88.69:5041/api/v1`
 */

import axios from 'axios';
import toast from 'react-hot-toast';
import { AUTH_SESSION_EXPIRED_EVENT } from '../context/AuthContext';

/** Puerto API por defecto en host Windows LAN / Kestrel / IIS. */
const DEFAULT_API_PORT = '5041';

/**
 * Resuelve la URL base de la API hacia el navegador (incluyendo `/api/v1`).
 * Se ejecuta por petición para que `same-host` use siempre el hostname con el que accedió el usuario.
 */
export function resolveApiBaseUrl(): string {
  const raw = (import.meta.env.VITE_API_URL as string | undefined)?.trim() || '/api/v1';
  const apiPort =
    (import.meta.env.VITE_API_PORT as string | undefined)?.trim() || DEFAULT_API_PORT;

  const wantsSameHost =
    raw === 'same-host' ||
    // Producción + ruta relativa caería en 404 en sitio IIS estático sin ARR
    (import.meta.env.PROD && raw.startsWith('/'));

  if (wantsSameHost) {
    if (typeof window === 'undefined') {
      return `http://localhost:${apiPort}/api/v1`;
    }
    return `${window.location.protocol}//${window.location.hostname}:${apiPort}/api/v1`;
  }

  return raw.replace(/\/$/, '');
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5041/api/v1',
  timeout: 15000, // 15 second timeout to prevent hanging requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar el token JWT y asegurar baseURL dinámica en cada petición
api.interceptors.request.use((config) => {
  config.baseURL = resolveApiBaseUrl();
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
