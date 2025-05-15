import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['./apiCalls/learningPathNode.test.ts'],
    setupFiles: './apiCalls/mockApiClient.ts',
  },
});
