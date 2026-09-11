import type { NextConfig } from "next";

// Origin of each zone this app proxies to. Read from the environment so the
// same build works locally (everything on localhost) and on AWS, where
// ClientConnectFrontEnd lives on Azure and the sibling portals may or may
// not be on the same host. Set these in the .env that ecosystem.config.js
// loads; the defaults are the local dev ports.
function zoneOrigin(envName: string, fallback: string): string {
  return (process.env[envName] || fallback).replace(/\/+$/, "");
}

// ClientConnectFrontEnd, built with BASE_PATH=/broker. Its real routes
// (pages, static assets, /api/auth/*) all live under /broker/*, so the prefix
// is forwarded as-is, never stripped.
const BROKER_DOMAIN = zoneOrigin("BROKER_DOMAIN", "http://localhost:4200");
// Group Life Broker/Admin portals (basePath /brokerPortal and /adminPortal).
const BROKER_PORTAL_ORIGIN = zoneOrigin("BROKER_PORTAL_ORIGIN", "http://localhost:3003");
const ADMIN_PORTAL_ORIGIN = zoneOrigin("ADMIN_PORTAL_ORIGIN", "http://localhost:3004");
// Company and Individual portals (assetPrefix /company-static, /individual-static).
const COMPANY_PORTAL_ORIGIN = zoneOrigin("COMPANY_PORTAL_ORIGIN", "http://localhost:3001");
const INDIVIDUAL_PORTAL_ORIGIN = zoneOrigin("INDIVIDUAL_PORTAL_ORIGIN", "http://localhost:3002");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/broker",
        destination: `${BROKER_DOMAIN}/broker`,
      },
      {
        source: "/broker/:path*",
        destination: `${BROKER_DOMAIN}/broker/:path*`,
      },
      // Group Life Broker/Admin portals. Previously children of
      // ClientConnectFrontEnd; now siblings under this zone so their
      // basePath-prefixed routes and assets resolve from the one origin.
      {
        source: "/brokerPortal",
        destination: `${BROKER_PORTAL_ORIGIN}/brokerPortal`,
      },
      {
        source: "/brokerPortal/:path*",
        destination: `${BROKER_PORTAL_ORIGIN}/brokerPortal/:path*`,
      },
      {
        source: "/adminPortal",
        destination: `${ADMIN_PORTAL_ORIGIN}/adminPortal`,
      },
      {
        source: "/adminPortal/:path*",
        destination: `${ADMIN_PORTAL_ORIGIN}/adminPortal/:path*`,
      },
      // The Group Life portals call ClientConnectFrontEnd's API routes with
      // root-relative fetches (/api/accessToken, /api/rmaForward/*), which
      // land on this zone's origin - forward them to CCFE under its /broker
      // basePath. This app itself serves auth under /auth/*, so /api/* is
      // free to delegate.
      {
        source: "/api/:path*",
        destination: `${BROKER_DOMAIN}/broker/api/:path*`,
      },
      {
        source: "/company/:path*",
        destination: `${COMPANY_PORTAL_ORIGIN}/company/:path*`,
      },
      {
        source: "/company-static/:path*",
        destination: `${COMPANY_PORTAL_ORIGIN}/company-static/:path*`,
      },
      {
        source: "/_next/image",
        destination: `${COMPANY_PORTAL_ORIGIN}/_next/image`,
      },
      // Individual Portal
      {
        source: "/individual",
        destination: `${INDIVIDUAL_PORTAL_ORIGIN}/individual`,
      },
      {
        source: "/individual/:path*",
        destination: `${INDIVIDUAL_PORTAL_ORIGIN}/individual/:path*`,
      },
      {
        source: "/individual-static/:path*",
        destination: `${INDIVIDUAL_PORTAL_ORIGIN}/individual-static/:path*`,
      },
    ];
  },
};

export default nextConfig;
