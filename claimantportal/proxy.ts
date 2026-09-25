import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerCognitoSession } from "@/lib/auth/cognitoSession.server";
import { getRmaRoles } from "@/lib/auth/rmaClaims";
import { logger } from "@/lib/logger";

// Next.js 16 renamed `middleware` to `proxy`. Reads the Cognito session
// memberportal's sign-in stored in cookies.
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
  const response = NextResponse.next();

  const { pathname } = request.nextUrl;
  // memberportal's rewrite is the normal way into this zone and already
  // gates on the Individual role, but this app is reachable on its own
  // origin too - guard /claimant here as well so that path isn't a bypass.
  // API routes are excluded: redirecting a fetch() to "/" (a page this app
  // doesn't have) surfaces as a bare 404 to the caller instead of a usable
  // error, and each route already enforces auth via auth0.getAccessToken().
  if (
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/claimant/api/") ||
    !pathname.startsWith("/claimant")
  ) {
    return response;
  }

  const { accessTokenClaims } = await getServerCognitoSession(request);
  if (getRmaRoles(accessTokenClaims).includes("Individual")) {
    return response;
  }

  // Signed out, or signed in without the Individual role: back to
  // memberportal's landing page, which logs in / routes by role.
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  // Runs on everything except static assets and metadata files. The broad
  // matcher is required for rolling sessions to work. Static files under
  // /individual/ (images, icons, fonts) must stay excluded too, or they get
  // caught by the "!pathname.startsWith('/individual')" check above and
  // redirected to login for anyone without the Individual role.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|claimant-static|claimant\\/.*\\.(?:svg|png|jpe?g|gif|ico|ttf|otf|woff2?)$).*)",
  ],
};
