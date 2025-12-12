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
  },
}

export default nextConfig
