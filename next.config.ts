import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['example.com', 'another-domain.com', 'question-bank-p.s3.ap-south-1.amazonaws.com'],
  },
};

export default nextConfig;
