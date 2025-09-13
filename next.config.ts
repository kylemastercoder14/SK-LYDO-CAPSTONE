import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["nyc-sk.com"],
  },
  devIndicators: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
