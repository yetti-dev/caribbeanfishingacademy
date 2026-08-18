import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    webpackMemoryOptimizations: true,
    preloadEntriesOnStart: false,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
    // Next 16 requires every `quality` prop value used in the app to be listed here.
    qualities: [60, 65, 66, 68, 70, 72, 75, 80],
  },
};

export default nextConfig;
