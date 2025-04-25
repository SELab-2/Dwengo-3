import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['./domain/*.domain.test.ts'],
  },
});
