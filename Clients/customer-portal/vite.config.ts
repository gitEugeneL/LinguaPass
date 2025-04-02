import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import fs from 'fs';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    https: {
      key: fs.readFileSync('devSecrets/key.pem'),
      cert: fs.readFileSync('devSecrets/cert.pem')
    },
    port: 5173
  }
});
