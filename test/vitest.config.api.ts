import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['./apiCalls/learningPath.test.ts'],
    setupFiles: './apiCalls/mockApiClient.ts',
  },
});
