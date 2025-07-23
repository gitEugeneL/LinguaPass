import fs from 'fs';
import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('devCerts/localhost+2-key.pem'),
      cert: fs.readFileSync('devCerts/localhost+2.pem')
    },
    port: 5174
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
