import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { JwtExpiredError } from "aws-jwt-verify/error";
import { SimpleJsonFetcher } from "aws-jwt-verify/https";
import { SimpleJwksCache } from "aws-jwt-verify/jwk";
import { amplifyConfig } from "@/lib/amplifyConfig";

// Cognito's JWKS endpoint (af-south-1) takes ~2s on a cold connection, over
// aws-jwt-verify's 1.5s default - which is why this doesn't go through
// @aws-amplify/adapter-nextjs: its built-in verifier uses that default, can't
// be configured, and treats the timeout as "invalid token", so every request
// looked signed out. The keys are cached on this module-level verifier after
// the first successful fetch.
const JWKS_TIMEOUT_MS = 5000;

const cognito = amplifyConfig.Auth?.Cognito;
const clientId = cognito?.userPoolClientId ?? "";

let verifier: ReturnType<typeof createVerifier> | undefined;

function createVerifier() {
  return CognitoJwtVerifier.create(
    { userPoolId: cognito?.userPoolId ?? "", clientId, tokenUse: "access" },
    {
      jwksCache: new SimpleJwksCache({
        fetcher: new SimpleJsonFetcher({
          defaultRequestOptions: { responseTimeout: JWKS_TIMEOUT_MS },
        }),
      }),
    },
  );
}

// Amplify writes its cookies through js-cookie, which percent-encodes the
// cookie *name* (e.g. an email username's "@" becomes "%40") but not the
// LastAuthUser *value*. Next doesn't decode names, so rebuild the name
// exactly as js-cookie did or the token cookie is never found.
function toCookieName(name: string): string {
  return encodeURIComponent(name)
    .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
    .replace(/[()]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

/** Anything with a Next-style cookies `get` - NextRequest.cookies or cookies(). */
type CookieReader = { get(name: string): { value: string } | undefined };

/**
 * Reads the access token Amplify's browser client stored in cookies
 * (Amplify.configure(..., { ssr: true })) and verifies it against the User
 * Pool. Returns undefined when signed out, or when the token is expired or
 * invalid - an expired token is refreshed by the browser client on its next
 * fetchAuthSession(), not here.
 */
async function readVerifiedAccessToken(
  cookieStore: CookieReader,
): Promise<{ token: string; claims: Record<string, unknown> } | undefined> {
  const prefix = `CognitoIdentityServiceProvider.${clientId}`;
  const username = cookieStore.get(`${prefix}.LastAuthUser`)?.value;
  if (!username) return undefined;

  const token = cookieStore.get(
    toCookieName(`${prefix}.${username}.accessToken`),
  )?.value;
  if (!token) return undefined;

  try {
    verifier ??= createVerifier();
    const claims = await verifier.verify(token);
    return { token, claims: claims as unknown as Record<string, unknown> };
  } catch (error) {
    if (!(error instanceof JwtExpiredError)) {
      console.error("[Cognito] Rejected access token cookie:", error);
    }
    return undefined;
  }
}

export interface ServerCognitoSession {
  /** Raw access token, for the API's Authorization header. */
  accessToken?: string;
  /** Decoded access token claims (rma_ids, rma_roles, ...). */
  accessTokenClaims?: Record<string, unknown>;
}

/**
 * Reads the Cognito session from the cookies memberportal's sign-in wrote.
 * Pass the request when calling from proxy.ts; call with no arguments from a
 * route handler or server component, where it reads via next/headers
 * cookies(). Returns {} when signed out.
 */
export async function getServerCognitoSession(
  request?: NextRequest,
): Promise<ServerCognitoSession> {
  const cookieStore = request?.cookies ?? (await cookies());
  const verified = await readVerifiedAccessToken(cookieStore);
  return { accessToken: verified?.token, accessTokenClaims: verified?.claims };
}
