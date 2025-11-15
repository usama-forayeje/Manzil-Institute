
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";

const config = defineConfig({
  plugins: [viteReact(), tailwindcss()],
  build: {
    outDir: "dist",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});

export default config;
