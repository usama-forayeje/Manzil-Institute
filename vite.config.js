import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

const config = defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['@tanstack/react-router'],
          ui: ['@radix-ui/react-slot', 'lucide-react'],
          utils: ['clsx', 'tailwind-merge', 'class-variance-authority'],
          swiper: ['swiper'],
          motion: ['motion'],
          forms: ['@tanstack/react-form', '@tanstack/zod-form-adapter', 'zod'],
          query: ['@tanstack/react-query'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: {
        safari10: true,
      },
    },
    cssMinify: true,
    sourcemap: false,
    reportCompressedSize: false,
  },
});

export default config;