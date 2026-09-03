import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth0, hasIndividualRole } from "@/lib/auth0";

// Next.js 16 renamed `middleware` to `proxy`. This mounts the Auth0 routes
// (/auth/login, /auth/logout, /auth/callback, /auth/profile, /auth/access-token)
// and keeps the rolling session cookie fresh on every request.
export async function proxy(request: NextRequest) {
  const authResponse = await auth0.middleware(request);

  const { pathname } = request.nextUrl;
  // memberportal's rewrite is the normal way into this zone and already
  // gates on the Individual role, but this app is reachable on its own
  // origin too - guard /individual here as well so that path isn't a bypass.
  if (pathname.startsWith("/auth/") || !pathname.startsWith("/individual")) {
    return authResponse;
  }

  const session = await auth0.getSession(request);
  if (hasIndividualRole(session?.tokenSet.accessToken)) {
    return authResponse;
  }

  const destination = new URL(session ? "/" : "/auth/login", request.url);
  if (!session) {
    destination.searchParams.set("returnTo", pathname);
  }

  const redirectResponse = NextResponse.redirect(destination);
  authResponse.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
  return redirectResponse;
}

export const config = {
  // Runs on everything except static assets and metadata files. The broad
  // matcher is required for rolling sessions to work. Static files under
  // /individual/ (images, icons, fonts) must stay excluded too, or they get
  // caught by the "!pathname.startsWith('/individual')" check above and
  // redirected to login for anyone without the Individual role.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|individual-static|individual\\/.*\\.(?:svg|png|jpe?g|gif|ico|ttf|otf|woff2?)$).*)",
  ],
};
