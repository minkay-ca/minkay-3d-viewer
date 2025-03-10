import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // For the zakeke-configurator-react global scripts
  build: {
    rollupOptions: {
      external: ['globals*.js'],
    },
  },
  define: {
    // This will make these globals available in the code
    'window.BABYLON': 'window.BABYLON',
    'BABYLON': 'window.BABYLON'
  },
}); 