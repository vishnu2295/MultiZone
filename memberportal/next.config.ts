import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // TODO: point back at https://cctest.randmutual.co.za before pushing —
      // pointed at the local ClientConnectFrontEnd dev server for testing.
      // ClientConnectFrontEnd now has basePath: "/broker" baked into its own
      // build, so its real routes (including static assets and auth routes)
      // live at /broker/* — the prefix must be forwarded as-is, not
      // stripped, and no separate /api/auth/* rule is needed anymore.
      {
        source: "/broker",
        destination: "http://localhost:4200/broker",
      },
      {
        source: "/broker/:path*",
        destination: "http://localhost:4200/broker/:path*",
      },
      // Group Life Broker/Admin portals. Previously children of
      // ClientConnectFrontEnd; now siblings under this zone so their
      // basePath-prefixed routes and assets resolve from the one origin.
      {
        source: "/brokerPortal",
        destination: "http://localhost:3003/brokerPortal",
      },
      {
        source: "/brokerPortal/:path*",
        destination: "http://localhost:3003/brokerPortal/:path*",
      },
      {
        source: "/adminPortal",
        destination: "http://localhost:3004/adminPortal",
      },
      {
        source: "/adminPortal/:path*",
        destination: "http://localhost:3004/adminPortal/:path*",
      },
      // The Group Life portals call ClientConnectFrontEnd's API routes with
      // root-relative fetches (/api/accessToken, /api/rmaForward/*), which
      // land on this zone's origin — forward them to CCFE under its /broker
      // basePath. This app itself serves auth under /auth/*, so /api/* is
      // free to delegate.
      {
        source: "/api/:path*",
        destination: "http://localhost:4200/broker/api/:path*",
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
