import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    extends: "vite.config.ts",
    test: {
      name: "unit",
      include: ["**/__tests__/**/*.test.(ts|tsx)"],
    },
  },
]);
