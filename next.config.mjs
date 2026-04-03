/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
  },
  // Enable compression
  compress: true,
  // TypeScript check settings - ignore during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // ESLint check settings - ignore during build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
