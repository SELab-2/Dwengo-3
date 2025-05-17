import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/domain/*.domain.test.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      provider: 'v8',
      all: true,
      include: ['server/domain/**/*.ts'],
    },
  },
});
