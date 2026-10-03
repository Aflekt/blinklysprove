import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    environment: "node",
    globals: false,
    setupFiles: ["./tests/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "tests/**/*.test.{ts,tsx}"],
    exclude: ["tests/live/**", "e2e/**", "node_modules/**"],
    coverage: { provider: "v8", include: ["src/**"], exclude: ["src/**/*.test.*", "src/**/generated/**"] },
  },
});
