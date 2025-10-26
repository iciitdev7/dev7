/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  // eslint: {
  //   ignoreDuringBuilds: true,
  // }
  // webpack(webpackConfig) {
  //   return {
  //     ...webpackConfig,
  //     optimization: {
  //       minimize: false,
  //     },
  //   };
  // }
};

module.exports = nextConfig;