import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['./frontend/components/*.test.ts', './domain/*.test.ts', './routes/*.test.ts'],
  },
});
