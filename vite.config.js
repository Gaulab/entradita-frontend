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
  define: {
    // eslint-disable-next-line no-undef
    'process.env.VITE_API_URL': process.env.VITE_API_URL,
    // eslint-disable-next-line no-undef
    'process.env.VITE_APP_NAME': process.env.VITE_APP_NAME,
  }
});
