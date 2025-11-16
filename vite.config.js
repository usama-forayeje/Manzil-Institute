
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
        manualChunks: (id) => {
          // Vendor libraries
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('@tanstack/react-router')) {
              return 'router-vendor';
            }
            if (id.includes('lucide-react') || id.includes('framer-motion')) {
              return 'ui-vendor';
            }
            if (id.includes('swiper')) {
              return 'swiper-vendor';
            }
            if (id.includes('zustand') || id.includes('zod')) {
              return 'state-vendor';
            }
            // Other large libraries
            return 'vendor';
          }

          // Application chunks
          if (id.includes('src/components/')) {
            if (id.includes('content-1') || id.includes('hero-section') || id.includes('MICCurriculum')) {
              return 'home-components';
            }
            if (id.includes('team') || id.includes('contact') || id.includes('footer')) {
              return 'shared-components';
            }
            if (id.includes('ui/')) {
              return 'ui-components';
            }
            return 'components';
          }

          if (id.includes('src/routes/')) {
            if (id.includes('admission') || id.includes('addmissionForm')) {
              return 'admission-chunk';
            }
            if (id.includes('curriculum')) {
              return 'curriculum-chunk';
            }
            if (id.includes('campus')) {
              return 'campus-chunk';
            }
            return 'routes';
          }

          if (id.includes('src/lib/') || id.includes('src/hooks/')) {
            return 'utils';
          }
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Disable minification (terser not available)
    minify: false,
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
