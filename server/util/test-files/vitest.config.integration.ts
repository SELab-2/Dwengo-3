import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['./persistence/**/*.test.ts'],
  },
});
