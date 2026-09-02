import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth0, canAccessZone, getRoleHomePath, ZONE_ROLES } from "@/lib/auth0";

// Zones gated by the roles claim - typing /company or /individual straight
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

// Next.js 16 renamed `middleware` to `proxy`. This mounts the Auth0 routes
// (/auth/login, /auth/logout, /auth/callback, /auth/profile, /auth/access-token)
// and keeps the rolling session cookie fresh on every request.
export async function proxy(request: NextRequest) {
  const authResponse = await auth0.middleware(request);

  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/auth/")) {
    return authResponse;
  }

  const matchedZone = matchZone(pathname);
  if (pathname !== "/" && !matchedZone) {
    return authResponse;
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
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|(?:company|individual)\\/.*\\.(?:svg|png|jpe?g|gif|ico|ttf|woff2?)$).*)",
  ],
};
