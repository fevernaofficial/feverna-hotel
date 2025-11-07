import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
    // 👇 This is crucial: disable Next’s body wrapper
    serverActions: false,
  },
};

export default nextConfig;
