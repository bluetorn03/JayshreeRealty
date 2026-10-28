import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Safe plugin to copy non-upload public assets without hitting Windows EBUSY / EPERM locks on large media
function copyPublicSafePlugin() {
  return {
    name: 'copy-public-safe',
    closeBundle() {
      const publicDir = path.resolve(__dirname, 'public');
      const distDir = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(publicDir) || !fs.existsSync(distDir)) return;
      const items = fs.readdirSync(publicDir);
      for (const item of items) {
        if (item === 'uploads') continue; // Handled safely and incrementally by postbuild script
        const src = path.join(publicDir, item);
        const dest = path.join(distDir, item);
        try {
          if (fs.statSync(src).isDirectory()) {
            fs.cpSync(src, dest, { recursive: true, force: true });
          } else {
            fs.copyFileSync(src, dest);
          }
        } catch (err: any) {
          console.warn(`[copy-public-safe] Notice for ${item}:`, err.message);
        }
      }
    }
  };
}

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://jayshreerealty.com',
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), copyPublicSafePlugin()],
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    copyPublicDir: false,
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
