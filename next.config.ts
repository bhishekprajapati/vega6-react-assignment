import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
    optimizePackageImports: ["@chakra-ui/react"],
  },
};

export default nextConfig;
