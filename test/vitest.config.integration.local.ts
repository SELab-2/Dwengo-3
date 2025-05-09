import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['./persistence/*.persistence.test.ts'],
  },
});