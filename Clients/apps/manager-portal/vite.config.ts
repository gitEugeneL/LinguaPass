import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { type ManifestOptions, VitePWA } from 'vite-plugin-pwa';

const manifest: Partial<ManifestOptions> | false = {
  theme_color: '#2B2A3AFF',
  background_color: '#2B2A3AFF',
  icons: [
    {
      purpose: 'maskable',
      sizes: '512x512',
      src: 'icons/icon512_maskable.png',
      type: 'image/png'
    },
    {
      purpose: 'any',
      sizes: '512x512',
      src: 'icons/icon512_rounded.png',
      type: 'image/png'
    }
  ],
  orientation: 'any',
  display: 'standalone',
  lang: 'en-US',
  name: 'Manager-portal',
  short_name: 'Manager',
  start_url: '/'
};

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      workbox: {
        globPatterns: ['**/*.{html,css,js,ico,png,svg}']
      },
      manifest: manifest
    })
  ],
  server: {
    port: 5174,
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
