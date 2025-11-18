// File: next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Konfigurasi gambar Prismic
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.prismic.io',
      },
    ],
  },
  
  // Transpile paket 3D
  transpilePackages: ["three", "@react-three/drei", "troika-three-text"],

  // --- INI YANG PENTING ---
  // Kita atur webpack manual buat benerin bug import 'webgl-sdf-generator'
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Paksa pake file .js biasa, bukan yang .mjs yang bikin error
      "webgl-sdf-generator": "webgl-sdf-generator/dist/webgl-sdf-generator.js",
    };
    return config;
  },
};

module.exports = nextConfig;