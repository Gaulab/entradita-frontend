import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  
  server: {
    host: '0.0.0.0',
    port: 5173,
  },

  build: {
    sourcemap: true, 
    rollupOptions: {
      external: [],
    },
    commonjsOptions: {
      include: [/node_modules/],
    },
  },

  optimizeDeps: {
    include: ['@radix-ui/react-select'],
  },

  define: {
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
    'process.env.VITE_APP_NAME': JSON.stringify(process.env.VITE_APP_NAME),
  },
});
