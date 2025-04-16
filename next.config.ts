import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['example.com', 'another-domain.com', 'cdn.your-service.com'],
  },
};

export default nextConfig;
