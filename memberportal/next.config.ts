import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/broker",
        destination: "https://cctest.randmutual.co.za",
      },
      {
        source: "/broker/:path*",
        destination: "https://cctest.randmutual.co.za/:path*",
      },
      {
        source: "/api/auth/:path*",
        destination: "https://cctest.randmutual.co.za/api/auth/:path*",
      },
      {
        source: "/company/:path*",
        destination: "http://localhost:3001/company/:path*",
      },
      {
        source: "/company-static/:path*",
        destination: "http://localhost:3001/company-static/:path*",
      },
      {
        source: "/_next/image",
        destination: "http://localhost:3001/_next/image",
      },
      // Individual Portal
      {
        source: "/individual",
        destination: "http://localhost:3002/individual",
      },
      {
        source: "/individual/:path*",
        destination: "http://localhost:3002/individual/:path*",
      },
      {
        source: "/individual-static/:path*",
        destination: "http://localhost:3002/individual-static/:path*",
      },
    ];
  },
};

export default nextConfig;
