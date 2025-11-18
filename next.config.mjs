/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Use static export to avoid Next.js 16.0.3 Turbopack static generation bug
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  // Enable compression
  compress: true,
  // Optimize fonts
  experimental: {
    optimizeFonts: true,
    optimizeCss: true,
  },
  // Enable SWC minification
  swcMinify: true,
};

export default nextConfig;
