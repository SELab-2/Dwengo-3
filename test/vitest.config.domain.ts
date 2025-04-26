import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['./domain/message.domain.test.ts'],
  },
});
