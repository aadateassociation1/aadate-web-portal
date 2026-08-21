import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  root: __dirname,
  publicDir: path.resolve(__dirname, "../../public"),
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  build: {
    outDir: path.resolve(__dirname, "../../dist-admin"),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../../src"),
    },
  },
  server: {
    host: "127.0.0.1",
    port: 8090,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4008",
        changeOrigin: true,
      },
    },
  },
});
