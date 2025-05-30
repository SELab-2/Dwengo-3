import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: './hooks/setUpHookMocks.ts',
    environment: 'jsdom',
    include: ['hooks/*.test.ts'],
  },
});
