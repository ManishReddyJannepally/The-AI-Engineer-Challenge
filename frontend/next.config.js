/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Only proxy API in development (localhost)
  // In production on Vercel, API is served from same domain
  async rewrites() {
    // Only apply rewrites in development
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: process.env.NEXT_PUBLIC_API_URL 
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`
            : 'http://localhost:8000/api/:path*',
        },
      ];
    }
    // In production, return empty array (no rewrites needed)
    return [];
  },
};

module.exports = nextConfig;

