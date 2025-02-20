import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import path from "path"

export default defineConfig(({mode}) => ({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "datenel-react",
      fileName: format => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["react"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        assetFileNames: assetInfo => {
          if (assetInfo.names[0].endsWith(".css")) {
            return "index.css";
          }
          return `assets/${assetInfo.names[0]}`;
        }
      },
    },
  },
  plugins: [
    react(),
    dts({
      tsconfigPath: "./tsconfig.app.json"
    }),
  ],
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