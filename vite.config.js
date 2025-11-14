import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  plugins: [tailwindcss(), tanstackStart(), viteReact()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    // Optimize chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['@tanstack/react-router'],
          ui: ['@radix-ui/react-slot', 'lucide-react'],
        },
      },
    },
    // Generate source maps for better debugging in production
    sourcemap: false,
    // Optimize CSS
    cssMinify: true,
    // Reduce bundle size
    minify: 'esbuild',
  },
})

export default config
