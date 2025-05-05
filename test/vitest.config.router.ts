import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/routes/*.test.ts'],
    setupFiles: './vitest.setup.ts',
    coverage: {
      reporter: ['text', 'json', 'html'],
      provider: 'v8',
      all: true,
      include: ['server/routes/**/*.ts'],
    },
  },
});
