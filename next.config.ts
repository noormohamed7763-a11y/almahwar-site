import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  // تسريع البناء وتحسين استيراد أيقونات Lucide
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;