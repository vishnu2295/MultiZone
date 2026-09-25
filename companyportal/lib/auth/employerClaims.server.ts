import { cookies } from "next/headers";
import serverApiService from "@/lib/api/serverApiService";
import { API_ROOT_BASE_URL } from "@/lib/api/apiService";
import { mapEmployerProfiles, type ApiOrganizationProfileResponse } from "@/content/site";
import { SELECTED_ROLE_PLAYER_COOKIE } from "./companyProfileCookie";
import { getServerCognitoSession } from "./cognitoSession.server";
import { classifyRmaRole, findRmaId, getRmaIds } from "./rmaClaims";

/**
 * Server-side counterpart to CompanyProfileProvider's selection: reads the
 * rolePlayerId mirrored into a cookie when the user picks a profile in the
 * switcher. Falls back to the first employerDetails entry for the user's org
 * (same bootstrap the provider does) if no selection cookie exists yet, e.g.
 * on the very first request before the client has hydrated.
 */
export async function getSelectedRolePlayerIdServer(): Promise<{
  token: string;
  rolePlayerId: number | undefined;
}> {
  const { accessToken: token, accessTokenClaims } = await getServerCognitoSession();
  if (!token) throw new Error("No active Cognito session.");

  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(SELECTED_ROLE_PLAYER_COOKIE)?.value;
  if (cookieValue) {
    return { token, rolePlayerId: Number(cookieValue) };
  }

  const coidId = findRmaId(getRmaIds(accessTokenClaims), "organization")?.coidId;
  if (!coidId) return { token, rolePlayerId: undefined };

  const response = await serverApiService.get<ApiOrganizationProfileResponse>(
    `${API_ROOT_BASE_URL}/profile/organization/${coidId}`,
    { token },
  );

  return { token, rolePlayerId: mapEmployerProfiles(response)[0]?.rolePlayerId };
}

/**
 * True when the current session's rma_ids claim includes an organization
 * role, i.e. the user is allowed into the Company Portal. Used to gate
 * /company at the layout level for users who are logged in but only have an
 * individual/employee profile (or no profile at all).
 */
export async function hasOrganizationAccessServer(): Promise<boolean> {
  const { accessTokenClaims } = await getServerCognitoSession();
  return getRmaIds(accessTokenClaims).some((entry) => classifyRmaRole(entry.role) === "organization");
}
