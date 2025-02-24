import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      '/ws': {
        target: 'ws://localhost:8000',
        ws: true,
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: "dist"
  }
});
