import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth0, canAccessZone, getRoleHomePath, ZONE_ROLES } from "@/lib/auth0";
import { logger } from "@/lib/logger";

// Zones gated by the roles claim - typing /company or /claimant straight
// into the URL bar must only work if the member actually holds that zone's
// role (a member can hold both), and never work at all if they're signed out.
const ROLE_ZONES = Object.keys(ZONE_ROLES);

function matchZone(pathname: string): string | undefined {
  return ROLE_ZONES.find(
    (zone) => pathname === zone || pathname.startsWith(`${zone}/`),
  );
}

// Copies the rolling-session cookies auth0.middleware just set onto a
// redirect response, so redirecting doesn't drop the refreshed session.
function withAuthCookies(response: NextResponse, authResponse: NextResponse) {
  authResponse.cookies.getAll().forEach((cookie) => response.cookies.set(cookie));
  return response;
}

// Paths next.config.ts rewrites to ClientConnectFrontEnd (BROKER_DOMAIN). Its
// auth handler builds redirect_uri/returnTo from x-forwarded-host and
// x-forwarded-proto, so whatever we forward is where Auth0 sends the user
// back to after login.
const CCFE_PATHS = ["/broker", "/api"];

function isCcfePath(pathname: string): boolean {
  return CCFE_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

// Behind CloudFront -> ALB the Host header this server receives is the ALB's
// DNS name and x-forwarded-proto is "http" (the ALB listener is plain http).
// Next's external-rewrite proxy then forwards x-forwarded-host = that Host,
// so CCFE bounced users to the ALB URL after login. Override both from
// APP_BASE_URL - the one place that knows the public origin - before the
// rewrite runs. Only applies to a pass-through (NextResponse.next) response;
// anything else auth0.middleware returned is left untouched.
function withPublicOrigin(request: NextRequest, authResponse: NextResponse) {
  if (authResponse.headers.get("x-middleware-next") !== "1") {
    return authResponse;
  }
  let publicUrl: URL;
  try {
    publicUrl = new URL(process.env.APP_BASE_URL ?? "");
  } catch {
    return authResponse;
  }
  const headers = new Headers(request.headers);
  headers.set("host", publicUrl.host);
  headers.set("x-forwarded-host", publicUrl.host);
  headers.set("x-forwarded-proto", publicUrl.protocol.replace(/:$/, ""));
  return withAuthCookies(
    NextResponse.next({ request: { headers } }),
    authResponse,
  );
}

// Next.js 16 renamed `middleware` to `proxy`. This mounts the Auth0 routes
// (/auth/login, /auth/logout, /auth/callback, /auth/profile, /auth/access-token)
// and keeps the rolling session cookie fresh on every request.
export async function proxy(request: NextRequest) {
  const startedAt = Date.now();
  const response = await handleRequest(request);
  // One access-log line per request. The query string is dropped in case it
  // carries personal data; redirects record where the user was sent.
  logger.info("Request", {
    method: request.method,
    path: request.nextUrl.pathname,
    redirectTo: response.headers.get("location")?.split("?")[0],
    durationMs: Date.now() - startedAt,
  });
  return response;
}

async function handleRequest(request: NextRequest) {
  const authResponse = await auth0.middleware(request);

  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/auth/")) {
    return authResponse;
  }

  const matchedZone = matchZone(pathname);
  if (pathname !== "/" && !matchedZone) {
    return isCcfePath(pathname)
      ? withPublicOrigin(request, authResponse)
      : authResponse;
  }

  const session = await auth0.getSession(request);

  if (matchedZone && !session) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("returnTo", pathname);
    return withAuthCookies(NextResponse.redirect(loginUrl), authResponse);
  }

  const accessToken = session?.tokenSet.accessToken;
  const roleHomePath = getRoleHomePath(accessToken);

  if (pathname === "/" && roleHomePath) {
    return withAuthCookies(
      NextResponse.redirect(new URL(roleHomePath, request.url)),
      authResponse,
    );
  }

  if (matchedZone && !canAccessZone(accessToken, matchedZone)) {
    return withAuthCookies(
      NextResponse.redirect(new URL(roleHomePath ?? "/", request.url)),
      authResponse,
    );
  }

  return authResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|(?:company|claimant|individual)\\/.*\\.(?:svg|png|jpe?g|gif|ico|ttf|otf|woff2?)$).*)",
  ],
};
