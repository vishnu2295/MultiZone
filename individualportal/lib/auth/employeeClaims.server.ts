import { getServerCognitoSession } from "./cognitoSession.server";
import { classifyRmaRole, findRmaId, getRmaIds } from "./rmaClaims";

/**
 * Server-only counterpart to getEmployeeCoidId(). Derives the employee coidId
 * from the caller's own session token instead of trusting a client-supplied
 * value, for use in route handlers that write on the user's behalf.
 */
export async function getEmployeeCoidIdServer(): Promise<{
  token: string;
  coidId: string | undefined;
}> {
  const { accessToken: token, accessTokenClaims } = await getServerCognitoSession();
  if (!token) throw new Error("No active Cognito session.");

  return { token, coidId: findRmaId(getRmaIds(accessTokenClaims), "individual")?.coidId };
}

/**
 * True when the current session's rma_ids claim includes an individual role,
 * i.e. the user is allowed into the Individual Portal. Used to gate
 * /individual at the layout level for users who are logged in but only have
 * an organization/employer profile (or no profile at all).
 */
export async function hasIndividualAccessServer(): Promise<boolean> {
  const { accessTokenClaims } = await getServerCognitoSession();
  return getRmaIds(accessTokenClaims).some((entry) => classifyRmaRole(entry.role) === "individual");
}
