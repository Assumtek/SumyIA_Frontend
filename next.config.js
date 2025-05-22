/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  // Desabilita o Edge Runtime para todas as páginas
  runtime: 'nodejs',
}

module.exports = nextConfig 