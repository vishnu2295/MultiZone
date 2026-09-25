import "@/lib/amplifyConfig";
import { fetchAuthSession, signOut } from "aws-amplify/auth";

/**
 * Browser-side Cognito tokens: the raw access token (sent as the API Bearer
 * token) and its decoded claims (where the rma_ids/rma_roles claims live).
 * Amplify refreshes an expired access token here automatically. Throws when
 * there's no session, which the call sites already catch.
 */
export async function getCognitoTokens(): Promise<{
  token: string;
  accessTokenClaims: Record<string, unknown>;
}> {
  const { tokens } = await fetchAuthSession();
  const token = tokens?.accessToken?.toString();
  if (!token) throw new Error("No active Cognito session.");
  return { token, accessTokenClaims: tokens?.accessToken?.payload ?? {} };
}

/** Signs out of Cognito and returns to memberportal's landing page. */
export async function cognitoLogout(): Promise<void> {
  await signOut({ global: true }).catch((error) => {
    console.error("Cognito sign-out failed:", error);
  });
  window.location.href = "/";
}
