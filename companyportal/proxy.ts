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
  // gates on the Organization role, but this app is reachable on its own
  // origin too - guard /company here as well so that path isn't a bypass.
  if (!pathname.startsWith("/company")) {
    return response;
  }

  const { accessTokenClaims } = await getServerCognitoSession(request);
  if (getRmaRoles(accessTokenClaims).includes("Organization")) {
    return response;
  }

  // Signed out, or signed in without the Organization role: back to
  // memberportal's landing page, which logs in / routes by role.
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|company-static|company\\/.*\\.(?:svg|png|jpe?g|gif|ico|ttf|otf|woff2?)$).*)",
  ],
};
