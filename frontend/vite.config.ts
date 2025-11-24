import path from "path";
import react from "@vitejs/plugin-react";
import reactswc from "@vitejs/plugin-react-swc";
import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => {
  return {
    plugins: [mode === "test" ? react({ fastRefresh: false }) : reactswc()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        react: path.resolve(__dirname, "./node_modules/react"),
        "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      },
    },
    base: "/",
    optimizeDeps: {
      exclude: ["@swc/wasm-web"],
    },
    test: {
      globals: true,
      environment: "happy-dom",
      setupFiles: ["./setup-tests.js"],
      silent: true,
      testTimeout: 15000,
      hookTimeout: 30000,
      coverage: {
        enabled: false,
        reporter: ["text", "lcov", "html"],
        provider: "v8",
        all: true,
        include: ["src/**/*.{ts,tsx}"],
        exclude: [
          "src/main.tsx",
          "src/App.tsx",
          "src/AppWrapper.tsx",
          "src/providers.tsx",
          "src/**/index.ts",
          "src/constants/**",
          "server/**",
          "shell.config.js",
          "**/*.d.ts",
          "**/coverage/**",
          "**/dist/**",
          "**/build/**",
          "**/node_modules/**",
          "**/types.ts",
          "**/config.ts",
          ...coverageConfigDefaults.exclude,
        ],
        lines: 90,
        functions: 90,
        statements: 90,
        branches: 90,
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom"],
            akinon_ui: ["@akinon/akitable", "@akinon/akifilter"],
          },
        },
      },
      chunkSizeWarningLimit: 1200,
    },
  };
});
