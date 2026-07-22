/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
      { source: '/conteudo', destination: '/conteudo', permanent: false },
      { source: '/kit/:slug', destination: '/kits', permanent: true },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/diagnostic/sessions/:id/answers',
        destination: '/api/v1/diagnostic/sessions/:id/answers/',
      },
      {
        source: '/api/v1/diagnostic/sessions/:id/recommendations',
        destination: '/api/v1/diagnostic/sessions/:id/recommendations/',
      },
    ];
  },
}

module.exports = nextConfig
