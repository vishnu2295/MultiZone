import { getCognitoTokens } from "./cognitoClient";
import { findRmaId, getRmaIds } from "./rmaClaims";

/** Access token plus the employee coidId pulled from the rma_ids claim. */
export async function getEmployeeCoidId(): Promise<{
  token: string;
  coidId: string | undefined;
}> {
  const { token, accessTokenClaims } = await getCognitoTokens();
  return { token, coidId: findRmaId(getRmaIds(accessTokenClaims), "individual")?.coidId };
}
