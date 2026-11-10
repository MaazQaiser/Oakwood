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
    ];
  },
};

export default nextConfig;
