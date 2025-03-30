import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['./routes/**/q*.test.ts'],
    setupFiles: './util/test-files/vitest.setup.ts',
  },
});
