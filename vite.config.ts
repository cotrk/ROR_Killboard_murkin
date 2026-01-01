/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(), 
    tsconfigPaths(),
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
    allow: ['..']
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
