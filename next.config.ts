/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',            // <= static export (no server)
  images: { unoptimized: true },
  domains: ['cdn.example.com'], // <= avoids Next image optimizer on shared hosting
  // (keep this if all images are local/public or you don’t need on-the-fly optimization)
};
module.exports = nextConfig;