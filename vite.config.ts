import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import path from "path"

export default defineConfig(({mode}) => ({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "datenel-react",
      fileName: format => `datenel.${format}.js`,
    },
    rollupOptions: {
      external: ["react"],
      output: {
        globals: {
          react: "React",
        },
      },
    },
  },
  plugins: [react(), dts()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    open: true,
    port: 1926
  },
  root: mode === "development" ? "playground" : ".",
  logLevel: "info",
}));