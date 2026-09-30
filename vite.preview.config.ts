import { defineConfig } from "vite";

export default defineConfig({
  root: "preview",
  base: "./",
  server: { host: "127.0.0.1", port: 5173, strictPort: true },
  build: { outDir: "../preview-dist", emptyOutDir: true },
});
