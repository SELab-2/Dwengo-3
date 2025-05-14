import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['./apiCalls/assignment.test.ts'],
    setupFiles: './apiCalls/mockApiClient.ts',
  },
});
