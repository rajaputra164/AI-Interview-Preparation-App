import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'vite-index.html')
      }
    }
  },
  server: {
    open: '/vite-index.html',
    port: 5173
  }
});