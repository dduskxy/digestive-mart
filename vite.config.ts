import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/digestive-mart/' : '/',
  plugins: [
    tailwindcss(),
  ],
  resolve: {
    preserveSymlinks: true,
  },
  server: {
    fs: {
      strict: false
    }
  }
});
