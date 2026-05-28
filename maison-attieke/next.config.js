/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Allow any HTTPS image from any domain (internet URLs)
      { protocol: 'https', hostname: '**' },
      // Allow HTTP from localhost (local dev server images)
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
}

module.exports = nextConfig
