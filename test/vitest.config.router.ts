import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['./routes/*.test.ts'],
    setupFiles: './vitest.setup.ts',
  },
});
