import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerCognitoSession } from "@/lib/auth/cognitoSession.server";
import { getRmaRoles } from "@/lib/auth/rmaClaims";

// Next.js 16 renamed `middleware` to `proxy`. Reads the Cognito session
// memberportal's sign-in stored in cookies.
export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  const { pathname } = request.nextUrl;
  // memberportal's rewrite is the normal way into this zone and already
  // gates on the Individual role, but this app is reachable on its own
  // origin too - guard /individual here as well so that path isn't a bypass.
  // API routes are excluded: redirecting a fetch() to "/" (a page this app
  // doesn't have) surfaces as a bare 404 to the caller instead of a usable
  // error, and each route enforces auth itself via getEmployeeCoidIdServer().
  if (pathname.startsWith("/individual/api/") || !pathname.startsWith("/individual")) {
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
  // Runs on everything except static assets and metadata files. Static files
  // under /individual/ (images, icons, fonts) must stay excluded too, or they
  // get caught by the "!pathname.startsWith('/individual')" check above and
  // redirected for anyone without the Individual role.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|individual-static|individual\\/.*\\.(?:svg|png|jpe?g|gif|ico|ttf|otf|woff2?)$).*)",
  ],
};
