const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  basePath: '/abuhind',
  assetPrefix: '/abuhind/',
  images: { unoptimized: true }, // needed for static export on shared hosting
  trailingSlash: true,           // optional but helps when exporting
}
