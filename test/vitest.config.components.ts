import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: './setUpMocks.tsx',
    environment: 'jsdom',
    include: ['components/*.test.tsx'],
  },
});
