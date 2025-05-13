import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: './hooks/setUpHookMocks.ts',
    environment: 'jsdom',
    include: ['hooks/*.test.ts'],
  },
});
