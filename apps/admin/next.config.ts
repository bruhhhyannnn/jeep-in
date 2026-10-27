import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  // Workspace packages ship TypeScript source.
  transpilePackages: ["@jeep-in/core"],
};

export default nextConfig;
