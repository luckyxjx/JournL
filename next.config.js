/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS?.split(',') || [],
  
  // Allow access from other devices on network
  async rewrites() {
    return []
  },
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          }
        ]
      }
    ]
  },
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Bundle optimization
  experimental: {
    optimizePackageImports: ['framer-motion', '@tiptap/react'],
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Optimize bundle splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
}

module.exports = nextConfig
