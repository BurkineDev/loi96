import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration expérimentale pour Next.js 15
  experimental: {
    // Server Actions activés par défaut dans Next.js 15
  },
  // Configuration des images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  // Turbopack config (Next.js 15+)
  turbopack: {
    resolveAlias: {
      canvas: false,
    },
  },
  // Webpack config pour pdf-parse (fallback)
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
