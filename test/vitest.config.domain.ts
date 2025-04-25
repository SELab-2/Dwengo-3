import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['./domain/*t.domain.test.ts'],
  },
});
