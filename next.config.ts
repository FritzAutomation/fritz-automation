import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Image optimization for external images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fwewqxbrijdklgcqzeeb.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Enable modern image formats
    formats: ['image/avif', 'image/webp'],
  },

  // Compression
  compress: true,

  // Headers for performance and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/(.*)\\.(ico|png|svg|jpg|jpeg|gif|webp|avif|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['sonner'],
  },
}

export default nextConfig
