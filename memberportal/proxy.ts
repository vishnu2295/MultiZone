import { auth0 } from "@/lib/auth0";

// Next.js 16 renamed `middleware` to `proxy`. This mounts the Auth0 routes
// (/auth/login, /auth/logout, /auth/callback, /auth/profile, /auth/access-token)
// and keeps the rolling session cookie fresh on every request.
export async function proxy(request: Request) {
  return await auth0.middleware(request);
}

export const config = {
  // Runs on everything except static assets and metadata files. The broad
  // matcher is required for rolling sessions to work.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
