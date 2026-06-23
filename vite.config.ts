import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import * as path from 'path'


export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router';
          }
          if (id.includes('node_modules/@mui/') || id.includes('node_modules/@emotion/')) {
            return 'vendor-mui';
          }
          if (id.includes('node_modules/')) return 'vendor-other';
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/uploads': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    css: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
})
