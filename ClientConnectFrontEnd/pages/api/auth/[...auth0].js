import {
  handleAuth,
  handleCallback,
  handleLogin,
  handleLogout,
} from "@auth0/nextjs-auth0";

// When this app is reached directly, req.headers.host is its own domain
// (AUTH0_BASE_URL). When it's reached through another app's rewrite proxy
// (e.g. memberportal's /broker/:path* rewrite), req.headers.host is that
// app's public domain instead, since Next.js rewrites forward the original
// Host header. Building the origin from the request keeps the user on
// whichever domain they actually came in on, instead of always bouncing
// them to AUTH0_BASE_URL.
function originFromRequest(req) {
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const protocol =
    req.headers["x-forwarded-proto"] || (req.socket?.encrypted ? "https" : "http");
  return `${protocol}://${host}`;
}

// With basePath set, this handler's own real route is /broker/api/auth/*,
// not /api/auth/*, and it doesn't come from next/link so Next won't prefix
// it for us — every path we build by hand here needs it added explicitly.
const basePath = process.env.BASE_PATH || "";

// The unauthenticated-visit path (index.js's getServerSideProps) reaches
// /api/auth/login via a server-side redirect, not a page the user clicked
// through from — browsers don't update Referer across automatic redirect
// hops, so it stays whatever page sent them to /broker in the first place,
// not /broker itself. Default to the app's own root under basePath instead;
// callers that want to return somewhere more specific (e.g. deep-linking
// back to /broker/Dashboard) can pass ?returnTo=/broker/Dashboard.
function returnToFromRequest(req, origin) {
  const { returnTo } = req.query;
  if (typeof returnTo === "string" && returnTo.startsWith("/")) {
    return `${origin}${returnTo}`;
  }
  return `${origin}${basePath}`;
}

export default handleAuth({
  callback: async (req, res) => {
    try {
      const origin = originFromRequest(req);
      await handleCallback(req, res, {
        redirectUri: `${origin}${basePath}/api/auth/callback`,
      });
    } catch (error) {
      res.writeHead(302, {
        Location: `${basePath}/Login?error=${encodeURIComponent(error.message)}`,
      });
      res.end();
    }
  },
  login: async (req, res) => {
    const origin = originFromRequest(req);
    await handleLogin(req, res, {
      authorizationParams: {
        prompt: "login",
        redirect_uri: `${origin}${basePath}/api/auth/callback`,
      },
      returnTo: returnToFromRequest(req, origin),
    });
  },
  logout: async (req, res) => {
    const origin = originFromRequest(req);
    await handleLogout(req, res, {
      returnTo: process.env.LOGOUT_RETURN_TO_URL || `${origin}${basePath}`,
    });
  },
});
 