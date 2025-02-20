import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import path from "path"
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js"

export default defineConfig(({mode}) => ({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "datenel-react",
      fileName: format => `index.${format}.js`,
    },
    rollupOptions: {
      preserveEntrySignatures: "strict",
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
    cssInjectedByJsPlugin()
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