import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            /node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom)[\\/]/.test(
              id,
            )
          ) {
            return 'vendor-react';
          }
        },
      },
    },
  },
});
