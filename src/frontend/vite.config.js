import { fileURLToPath, URL } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  logLevel: "error",
  build: {
    emptyOutDir: true,
    sourcemap: false,
    minify: false,
  },
  css: {
    postcss: "./postcss.config.js",
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  define: {
    "process.env.CANISTER_ID_BACKEND": JSON.stringify(""),
    "process.env.DFX_NETWORK": JSON.stringify(""),
    "process.env.II_URL": JSON.stringify("https://identity.internetcomputer.org/"),
    "process.env.STORAGE_GATEWAY_URL": JSON.stringify("https://blob.caffeine.ai"),
    "process.env.BASE_URL": JSON.stringify("/"),
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(new URL("../declarations", import.meta.url)),
      },
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
    dedupe: ["@dfinity/agent"],
  },
});
