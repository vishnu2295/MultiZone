import { auth0 } from "@/lib/auth0";
import { decodeJwtPayload, type RmaId } from "./employerClaims";

/**
 * Server-only counterpart to getEmployerCoidId(). Derives the employer coidId
 * from the caller's own session token instead of trusting a client-supplied
 * value, for use in route handlers that write on the user's behalf.
 */
export async function getEmployerCoidIdServer(): Promise<{
  token: string;
  coidId: string | undefined;
}> {
  const { token } = await auth0.getAccessToken();
  const claims = decodeJwtPayload(token);
  const rmaIds = claims[
    process.env.NEXT_PUBLIC_AUTH0_IDENTIFIER as string
  ] as RmaId[] | undefined;

  return { token, coidId: rmaIds?.[0]?.coidId };
}
