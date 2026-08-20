/** @type {import('next').NextConfig} */
const nextConfig = {
  // Empty by default (existing direct-access deployments are unaffected).
  // Set BASE_PATH=/broker when this build is deployed behind another app's
  // proxy at that mount path. Baked in at build time — a proxied deployment
  // needs its own build with BASE_PATH set, it can't share one with a
  // direct-access build.
  basePath: process.env.BASE_PATH || "",
  compiler: {
    styledComponents: {
      displayName: false,
    },
  },
  // reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.randmutual.co.za",
        pathname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
