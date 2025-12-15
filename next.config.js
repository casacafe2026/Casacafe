// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'quzyhbqmmjeyphbrnecz.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/menu-images/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    unoptimized: true, // Important for Supabase storage images
  },
}

module.exports = nextConfig