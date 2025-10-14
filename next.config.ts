/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',            // we are exporting static files
  basePath: '/abuhind',        // <-- IMPORTANT
  assetPrefix: '/abuhind/',    // <-- IMPORTANT
  
  trailingSlash: true          // optional but nice for static hosting
};

module.exports = nextConfig;
