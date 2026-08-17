import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    host: true, // Permite que Vite escuche en la red local
    port: 5175,
    proxy: {
      // Cualquier petición que empiece con /api, Vite la reenviará al backend en localhost:5041
      '/api': {
        target: 'http://localhost:5041',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    port: 5175,
  },
});
