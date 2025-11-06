/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Local development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      // Production backend (update with your actual backend domain)
      {
        protocol: 'https',
        hostname: '*.railway.app', // Railway
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: '*.onrender.com', // Render
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'api.fritzautomation.dev', // Custom domain
        pathname: '/media/**',
      },
      // Frontend domain (if backend is on same domain)
      {
        protocol: 'https',
        hostname: 'www.fritzautomation.dev',
        pathname: '/media/**',
      },
      // External image sources
      {
        protocol: 'https',
        hostname: 'cdn.simpleicons.org', // Simple Icons
      },
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com', // Flaticon
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com', // Imgur
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Unsplash
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/:path*',
      },
    ];
  },
};

export default nextConfig;
