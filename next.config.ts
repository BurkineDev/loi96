import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  // Turbopack config vide (Next.js 16+)
  turbopack: {},
};

export default nextConfig;
