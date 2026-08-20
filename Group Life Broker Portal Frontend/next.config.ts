import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  basePath: "/brokerPortal",
  turbopack: {
    root: path.resolve(__dirname, ".."),
  },
  async rewrites() {
    return [
      {
        source: "/api/cc/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
