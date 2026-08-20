import { auth0 } from "@/lib/auth0";
import { classifyRmaRole, decodeJwtPayload, findRmaId, type RmaId } from "./employeeClaims";

/**
 * Server-only counterpart to getEmployeeCoidId(). Derives the employee coidId
 * from the caller's own session token instead of trusting a client-supplied
 * value, for use in route handlers that write on the user's behalf.
 */
export async function getEmployeeCoidIdServer(): Promise<{
  token: string;
  coidId: string | undefined;
}> {
  const { token } = await auth0.getAccessToken();
  const claims = decodeJwtPayload(token);
  const rmaIds =
    (claims[process.env.NEXT_PUBLIC_AUTH0_IDENTIFIER as string] as
      | RmaId[]
      | undefined) ?? [];

  return { token, coidId: findRmaId(rmaIds, "individual")?.coidId };
}

/**
 * True when the current session's rma_ids claim includes an individual role,
 * i.e. the user is allowed into the Individual Portal. Used to gate
 * /individual at the layout level for users who are logged in but only have
 * an organization/employer profile (or no profile at all).
 */
export async function hasIndividualAccessServer(): Promise<boolean> {
  try {
    const { token } = await auth0.getAccessToken();
    const claims = decodeJwtPayload(token);
    const rmaIds =
      (claims[process.env.NEXT_PUBLIC_AUTH0_IDENTIFIER as string] as
        | RmaId[]
        | undefined) ?? [];

    return rmaIds.some((entry) => classifyRmaRole(entry.role) === "individual");
  } catch {
    return false;
  }
}
