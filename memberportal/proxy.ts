import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getRolesFromAccessToken, getServerCognitoSession } from "@/lib/cognitoSession";
import { canAccessZone, getRoleHomePath, ZONE_ROLES } from "@/lib/roles";
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

// Paths next.config.ts rewrites to ClientConnectFrontEnd (BROKER_DOMAIN). Its
// auth handler builds redirect_uri/returnTo from x-forwarded-host and
// x-forwarded-proto, so whatever we forward is where it sends the user back
// to after login.
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
// rewrite runs.
function withPublicOrigin(request: NextRequest) {
  let publicUrl: URL;
  try {
    publicUrl = new URL(process.env.APP_BASE_URL ?? "");
  } catch {
    return NextResponse.next();
  }
  const headers = new Headers(request.headers);
  headers.set("host", publicUrl.host);
  headers.set("x-forwarded-host", publicUrl.host);
  headers.set("x-forwarded-proto", publicUrl.protocol.replace(/:$/, ""));
  return NextResponse.next({ request: { headers } });
}

// Next.js 16 renamed `middleware` to `proxy`. Gates "/" and the role zones on
// the Cognito session the browser's Amplify client stores in cookies.
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
  // const authResponse = await auth0.middleware(request);

  const { pathname } = request.nextUrl;

  const matchedZone = matchZone(pathname);
  if (pathname !== "/" && !matchedZone) {
    return isCcfePath(pathname) ? withPublicOrigin(request) : NextResponse.next();
  }

  const cognitoSession = await getServerCognitoSession(request);
  const hasSession = Boolean(cognitoSession.accessToken);
  const roles = getRolesFromAccessToken(cognitoSession.accessToken);

  // Signed-out visitors land on "/", where the navbar's Login opens the
  // Cognito auth modal.
  if (matchedZone && !hasSession) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const roleHomePath = getRoleHomePath(roles);

  if (pathname === "/" && roleHomePath) {
    return NextResponse.redirect(new URL(roleHomePath, request.url));
  }

  if (matchedZone && !canAccessZone(roles, matchedZone)) {
    return NextResponse.redirect(new URL(roleHomePath ?? "/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|(?:company|claimant|individual)\\/.*\\.(?:svg|png|jpe?g|gif|ico|ttf|otf|woff2?)$).*)",
  ],
};
