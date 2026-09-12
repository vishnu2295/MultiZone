import { NextResponse } from "next/server";
import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { apiService } from "./api/apiService";

const RMA_ROLES_CLAIM = "https://rma.com/claims/rma_roles";
const PROFILE_STATUS_CLAIM = "https://rma.com/claims/profile_status";
// Base domain of the registration API. See .env.example.
const REGISTER_API_DOMAIN = process.env.REGISTER_API_DOMAIN ?? "";
const REGISTRATION_URL = `${REGISTER_API_DOMAIN}/api/mobileApp/public/registration/register`;

// The roles claim is issued on the access token (audience-scoped), not the ID
// token, so session.user won't have it. We just received this token straight
// from Auth0's token endpoint over TLS during this callback, so decoding the
// payload without re-verifying the signature is safe here.
function decodeAccessTokenClaims(accessToken: string): Record<string, unknown> {
  const payload = accessToken.split(".")[1];
  return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
}

// Role required to access each zone. A member can hold both roles (e.g. an
// Organization admin who is also an Individual member) and gets both zones -
// this is a membership check per zone, not a single computed "home".
export const ZONE_ROLES: Record<string, string> = {
  "/company": "Organization",
  "/individual": "Individual",
};

export function getRoles(accessToken: string | undefined): string[] {
  if (!accessToken) return [];
  const claims = decodeAccessTokenClaims(accessToken);
  return (claims[RMA_ROLES_CLAIM] as string[] | undefined) ?? [];
}

export function canAccessZone(
  accessToken: string | undefined,
  zone: string,
): boolean {
  const requiredRole = ZONE_ROLES[zone];
  if (!requiredRole) return true;
  return getRoles(accessToken).includes(requiredRole);
}

// Default zone to land a member on right after login or when they hit "/" -
// used only to pick one starting point for someone with multiple roles, not
// to gate access (see canAccessZone for that).
export function getRoleHomePath(
  accessToken: string | undefined,
): string | null {
  const roles = getRoles(accessToken);
  if (roles.includes("Organization")) return "/company";
  if (roles.includes("Individual")) return "/individual";
  return null;
}

// Reads AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_SECRET and
// APP_BASE_URL from the environment. See .env.example for the full list.
export const auth0 = new Auth0Client({
  authorizationParameters: {
    // Set AUTH0_AUDIENCE to the identifier of the API registered in Auth0 to
    // receive an access token for it. Without it Auth0 only issues an ID token.
    audience: process.env.AUTH0_AUDIENCE,
    // offline_access is what makes refresh tokens (and silent renewal) work.
    scope: "openid profile email offline_access",
  },
  async onCallback(error, ctx, session) {
    const baseUrl = ctx.appBaseUrl ?? process.env.APP_BASE_URL ?? "";
    const token = session?.tokenSet.accessToken;
    console.log(token);
    if (error) {
      console.log("Auth0 callback error", error);
      return NextResponse.redirect(`${baseUrl}/auth/login`);
    }

    let accessToken = session?.tokenSet.accessToken;
    const refreshToken = session?.tokenSet.refreshToken;
    const profileStatus = accessToken
      ? (decodeAccessTokenClaims(accessToken)[PROFILE_STATUS_CLAIM] as
          | string
          | undefined)
      : undefined;
    console.log("Profile Status:", profileStatus);
    // Missing claim (undefined) is treated the same as "not linked yet" -
    // register whenever profileStatus isn't explicitly "Linked".
    const needsRegistration = !profileStatus || profileStatus !== "Linked";
    if (accessToken && refreshToken && needsRegistration) {
      console.log("Calling registration API:", REGISTRATION_URL);
      try {
        const registrationResponse = await apiService.post<{
          access_token: string;
        }>(
          REGISTRATION_URL,
          { accessToken, refreshToken, SourceChannel: "ClientPortal" },
          { skipAuth: true },
        );
        console.log("Registration API response:", registrationResponse);

        // The registration API issues its own access token - use it for all
        // further API calls in place of Auth0's, by overwriting it on the
        // session before it's persisted. auth0.getAccessToken() and
        // serverApiService read from this session going forward.
        if (registrationResponse.access_token && session) {
          session.tokenSet.accessToken = registrationResponse.access_token;
          accessToken = registrationResponse.access_token;
        }
      } catch (registrationError) {
        console.error(
          "Registration API call failed during login callback",
          registrationError,
        );
        return NextResponse.redirect(`${baseUrl}/auth/login`);
      }
    } else {
      console.log("Registration API not called. Conditions:", {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        needsRegistration,
      });
    }
    const returnTo = getRoleHomePath(accessToken) ?? ctx.returnTo ?? "/";

    return NextResponse.redirect(`${baseUrl}${returnTo}`);
  },
});
