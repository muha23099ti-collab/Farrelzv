const nextConfig = {
  // PERBAIKAN: Menambahkan konfigurasi ini untuk mengatasi error Vercel
  webpack: (config) => {
    config.externals.push('troika-three-text');
    return config;
  },
};

module.exports = nextConfig;
