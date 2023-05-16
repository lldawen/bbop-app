// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   devIndicators: {
//       buildActivity: false
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
// }

// module.exports = nextConfig

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  // scope: '/app',
  // sw: 'service-worker.js',
  //...
})

module.exports = withPWA({
  reactStrictMode: true,
  devIndicators: {
      buildActivity: false
  },
  typescript: {
    ignoreBuildErrors: true,
  },
})