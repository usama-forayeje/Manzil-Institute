/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
  },
  // Server action payload limit for multi-step forms (under experimental)
  experimental: {
    serverActions: {
      bodySizeLimit: '8mb',
    },
  },

  // Canonical domain redirect: ensure www.institute.manzil.group always routes to https://institute.manzil.group
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.institute.manzil.group',
          },
        ],
        destination: 'https://institute.manzil.group/:path*',
        permanent: true,
      },
    ];
  },

  // Enable compression
  compress: true,
  // TypeScript check settings - ignore during build
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
