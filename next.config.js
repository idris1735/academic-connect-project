/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/auth/:path*',
        destination: 'http://localhost:5000/auth/:path*', // Proxy auth requests to backend
      },
      {
        source: '/chats/:path*',
        destination: 'http://localhost:5000/chats/:path*',
      },
      {
        source: '/user/:path*',
        destination: 'http://localhost:5000/user/:path*',
      },
    ]
  },
}

module.exports = nextConfig
