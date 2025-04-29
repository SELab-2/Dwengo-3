import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/persistence/*.persistence.test.ts'],
    globalSetup: ['./cleanDatabase.ts'],
    globalTeardown: ['./cleanDatabase.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      provider: 'v8',
      all: true,
      include: ['server/persistence/**/*.ts'],
    },
  },
});
