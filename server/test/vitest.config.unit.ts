import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['./test/domain/*.test.ts', './test/routes/*.test.ts'],
  },
});
