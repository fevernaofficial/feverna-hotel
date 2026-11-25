import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  async redirects() {
    const deferredRoutes = [
      "/gift",
      "/caretaker",
      "/desk",
      "/hallway0",
      "/hallway1",
      "/hallway2",
      "/elevator",
      "/boiler",
      "/chapel",
      "/courtyard",
      "/ballroom",
      "/the-ache/101",
      "/lost-and-found",
      "/lost-and-found/enter",
    ];

    return deferredRoutes.map((source) => ({
      source,
      destination: "/",
      permanent: false,
    }));
  },
};

export default nextConfig;
