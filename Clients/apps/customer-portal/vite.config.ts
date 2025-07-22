import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('devCerts/localhost+2-key.pem'),
      cert: fs.readFileSync('devCerts/localhost+2.pem')
    },
    port: 5173
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
