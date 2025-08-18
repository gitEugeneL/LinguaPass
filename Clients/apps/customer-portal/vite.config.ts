import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../../packages/shared/src')
    }
  },
  css: {
    modules: {
      localsConvention: 'camelCase'
    },
    postcss: './postcss.config.js'
  }
});
