import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Server rejimi */
  images: {
    unoptimized: true,
  },
  // [EKSTREMAL OPTIMIZATSIYA] - Eng past resursda ishlash uchun
  webpack: (config, { dev, isServer }) => {
    if (dev) {
        config.watchOptions = {
            ignored: ['**/data/**', '**/node_modules/**', '**/.next/**'],
            poll: false, // Pollingni o'chirib qo'yamiz, bu CPU yeydi
        };
        // Katta loyihalar uchun source map-ni soddalashtiramiz (CPU-ni tejaydi)
        config.devtool = 'eval-cheap-module-source-map';
    }
    return config;
  },
  
  // Dev serverni yengillashtirish uchun
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  
  // Experimental optimizations
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "recharts"],
  }
};

export default nextConfig;
