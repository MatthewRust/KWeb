import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // In local dev, forward API calls to the backend (in Docker, nginx does this).
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
