import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 600, // Suppress warning for known large chunks
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-core';
          }
          // Router
          if (id.includes('node_modules/react-router-dom/') || id.includes('node_modules/react-router/')) {
            return 'router';
          }
          // Icons (large - split separately)
          if (id.includes('node_modules/lucide-react/')) {
            return 'icons';
          }
          // Supabase client
          if (id.includes('node_modules/@supabase/')) {
            return 'supabase';
          }
          // Admin panel components (only loaded on /admin route)
          if (id.includes('/src/components/admin/') || id.includes('/src/pages/AdminDashboard')) {
            return 'admin';
          }
          // Data context
          if (id.includes('/src/context/') || id.includes('/src/services/')) {
            return 'app-core';
          }
        },
      },
    },
  },
});
