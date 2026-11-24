import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  images: {
    qualities: [75, 92],
  },
  async redirects() {
    return [
      {
        source: "/faq",
        destination: "/help",
        permanent: true,
      },
      {
        source: "/aftersales",
        destination: "/service",
        permanent: true,
      },
      {
        source: "/deposit-rules",
        destination: "/legal/reservation",
        permanent: true,
      },
      {
        source: "/request-a-refund",
        destination: "/help",
        permanent: true,
      },
      {
        source: "/complaints",
        destination: "/problem-with-your-car",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/used-cars/:band(under-\\d+|over-\\d+)",
        destination: "/used-cars/price/:band",
      },
    ];
  },
};

export default nextConfig;
