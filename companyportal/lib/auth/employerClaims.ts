import { getCognitoTokens } from "./cognitoClient";
import { findRmaId, getRmaIds } from "./rmaClaims";

/** Access token plus the employer coidId pulled from the rma_ids claim. */
export async function getEmployerCoidId(): Promise<{
  token: string;
  coidId: string | undefined;
}> {
  const { token, accessTokenClaims } = await getCognitoTokens();
  return { token, coidId: findRmaId(getRmaIds(accessTokenClaims), "organization")?.coidId };
}
