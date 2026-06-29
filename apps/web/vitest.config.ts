import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "@german-coach/vocabulary": path.resolve(
        __dirname,
        "../../packages/vocabulary/src/index.ts"
      ),
      "@german-coach/exams": path.resolve(__dirname, "../../packages/exams/src/index.ts"),
    },
  },
});
