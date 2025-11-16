
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";

const config = defineConfig({
  plugins: [viteReact(), tailwindcss()],
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks: {
          // Split large dependencies into separate chunks
          vendor: ['react', 'react-dom'],
          router: ['@tanstack/react-router'],
          ui: ['lucide-react', 'framer-motion'],
          swiper: ['swiper'],
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Enable source maps for production debugging
    sourcemap: false,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  // Optimize images
  assetsInclude: ['**/*.webp', '**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.svg'],
});

export default config;
