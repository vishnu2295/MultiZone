import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Company Portal
      // {
      //   source: "/",
      //   destination: "http://localhost:3000",
      // },
      // {
      //   source: "/company",
      //   destination: "http://localhost:3001/company",
      // },
      // {
      //   source: "/company/:path*",
      //   destination: "http://localhost:3001/company/:path*",
      // },
      // {
      //   source: "/company-static/:path*",
      //   destination: "http://localhost:3001/company-static/:path*",
      // },
      {
        source: "/home/:path*",
        destination: "http://localhost:3001/home/:path*",
      },
      {
        source: "/home/:path*",
        destination: "http://localhost:3001/home/:path*",
      },
      {
        source: "/home-static/:path*",
        destination: "http://localhost:3001/home-static/:path*",
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
