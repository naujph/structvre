/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  images: {
    domains: ['images.unsplash.com', 'placehold.co'],
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  async redirects() {
    return [
      // Caminhos antigos do Flask
      { source: '/diagnostico/v2', destination: '/diagnostico', permanent: true },
      { source: '/kit/:slug', destination: '/kits', permanent: true },
    ];
  },
}

module.exports = nextConfig
