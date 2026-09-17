import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth0 } from "@/lib/auth0";


export async function proxy(request: NextRequest) {
  const authResponse = await auth0.middleware(request);

  console.log("mansur");

  const { pathname } = request.nextUrl;
  // memberportal's rewrite is the normal way into this zone and already
  // gates on the Organization role, but this app is reachable on its own
  // origin too - guard /company here as well so that path isn't a bypass.
  if (pathname.startsWith("/auth/") || !pathname.startsWith("/company")) {
    return authResponse;
  }

  const session = await auth0.getSession(request);
  // if (hasOrganizationRole(session?.tokenSet.accessToken)) {
  //   return authResponse;
  // }

  const destination = new URL(session ? "/" : "/auth/login", request.url);
  if (!session) {
    destination.searchParams.set("returnTo", pathname);
  }

  const redirectResponse = NextResponse.redirect(destination);
  authResponse.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
  return redirectResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|(?:company|individual)\\/.*\\.(?:svg|png|jpe?g|gif|ico|ttf|otf|woff2?)$).*)",
  ],
};
