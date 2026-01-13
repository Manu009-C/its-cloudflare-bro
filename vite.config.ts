import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      entryRoot: "src",
      insertTypesEntry: true
    })
  ],
  css: {
    // Ensure Tailwind runs for both dev + library builds.
    postcss: "./postcss.config.cjs"
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "ItsCloudflareBro",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "cjs" ? "index.cjs" : "index.js")
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith(".css")) return "style.css";
          return "assets/[name]-[hash][extname]";
        },
        globals: {
          react: "React",
          "react-dom": "ReactDOM"
        }
      }
    }
  }
});

