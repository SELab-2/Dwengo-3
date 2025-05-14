import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['./apiCalls/*.test.ts'],
    setupFiles: './apiCalls/mockApiClient.ts',
  },
});
