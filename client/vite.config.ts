import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5174,
    open: true,
    watch: {
      usePolling: true,
      interval: 100, // Faster checking
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
      '/analytics': {
        target: 'http://localhost:8000', // FastAPI backend (PyDataPRO)
        changeOrigin: true,
        secure: false,
      }
    },
  },
});
