import { defineConfig } from 'vite';

export default defineConfig({
  base: '/clima/',
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});