/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: {
        name: 'Killboard - Return of Reckoning',
        short_name: 'Killboard',
        description:
          'Real-time kill statistics and leaderboard for Return of Reckoning MMORPG',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#bf4000',
        orientation: 'portrait-primary',
        scope: '/',
        lang: 'en',
        categories: ['games', 'entertainment', 'social'],
        icons: [
          {
            src: '/favicon.ico',
            sizes: 'any',
            type: 'image/x-icon',
          },
        ],
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        minify: true,
        sourcemap: true,
      },
    }),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  server: {
    port: 3000,
    fs: {
      strict: false,
      allow: ['..'],
    },
  },
  build: {
    outDir: './build',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router'],
          apollo: ['@apollo/client', 'graphql'],
          charts: ['recharts'],
          utils: ['lodash', 'date-fns'],
        },
      },
    },
  },
});
