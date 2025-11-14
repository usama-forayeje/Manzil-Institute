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
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
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
