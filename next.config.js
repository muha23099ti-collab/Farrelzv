/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.prismic.io',
      },
    ],
  },
  transpilePackages: ["three", "@react-three/drei", "troika-three-text"],
};

module.exports = nextConfig;