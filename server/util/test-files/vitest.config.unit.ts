import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["./domain/**/*.test.ts", "./routes/**/*.test.ts"],
  },
});
