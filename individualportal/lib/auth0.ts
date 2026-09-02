import { Auth0Client } from "@auth0/nextjs-auth0/server";

const RMA_ROLES_CLAIM = "https://rma.com/claims/rma_roles";

// The roles claim is issued on the access token (audience-scoped), not the ID
// token, so session.user won't have it. We just received this token straight
// from Auth0's token endpoint over TLS during this callback, so decoding the
// payload without re-verifying the signature is safe here.
function decodeAccessTokenClaims(accessToken: string): Record<string, unknown> {
  const payload = accessToken.split(".")[1];
  return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
}

// This zone decrypts the session cookie memberportal's login created (same
// AUTH0_SECRET), so it can - and must - check the role itself: memberportal's
// rewrite is the normal way in, but it's not the only possible way in.
export function hasIndividualRole(accessToken: string | undefined): boolean {
  if (!accessToken) return false;
  const claims = decodeAccessTokenClaims(accessToken);
  const roles = (claims[RMA_ROLES_CLAIM] as string[] | undefined) ?? [];
  return roles.includes("Individual");
}

// Reads AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_SECRET and
// APP_BASE_URL from the environment. See .env.local.example for the full list.
//
// Must use the same AUTH0_SECRET/AUTH0_DOMAIN/AUTH0_CLIENT_ID as memberportal
// so this zone can decrypt the session cookie memberportal's login created.
export const auth0 = new Auth0Client({
  authorizationParameters: {
    // Set AUTH0_AUDIENCE to the identifier of the API registered in Auth0 to
    // receive an access token for it. Without it Auth0 only issues an ID token.
    audience: process.env.AUTH0_AUDIENCE,
    // offline_access is what makes refresh tokens (and silent renewal) work.
    scope: "openid profile email offline_access",
  },
});
