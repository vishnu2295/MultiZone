import { NextRequest, NextResponse } from "next/server";
import serverApiService from "@/lib/api/serverApiService";
import { API_ROOT_BASE_URL } from "@/lib/api/apiService";
import { apiErrorResponse } from "@/lib/api/routeHandlerError";
import { getEmployerCoidIdServer } from "@/lib/auth/employerClaims.server";
import type { ApiOrganizationProfileResponse } from "@/content/site";
import type { ApiClaim } from "@/content/claims";

/**
 * Proxies GET /employer/claim/{claimReferenceNumber}, which additionally
 * requires the acting employer's rolePlayerId (not the claim's own
 * rolePlayerId/claimantId) as a query param. That value isn't on the Auth0
 * session claims, so it's read from the organization profile endpoint first,
 * the same source ProfileMenuCard/HomeGreeting already use for coidId-scoped
 * profile data.
 */
export async function GET(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get("ref");
  if (!ref) {
    return NextResponse.json({ error: "Missing ref query param" }, { status: 400 });
  }

  const { coidId } = await getEmployerCoidIdServer();
  if (!coidId) {
    return NextResponse.json({ error: "No employer found for the current user" }, { status: 403 });
  }

  try {
    const profile = await serverApiService.get<ApiOrganizationProfileResponse>(
      `${API_ROOT_BASE_URL}/profile/organization/${coidId}`,
    );
    const rolePlayerId = profile.employerDetails[0]?.rolePlayerId;

    const claim = await serverApiService.get<ApiClaim>(
      `/employer/claim/${encodeURIComponent(ref)}`,
      { params: { rolePlayerId } },
    );

    return NextResponse.json(claim);
  } catch (error) {
    return apiErrorResponse(error, "Failed to load claim");
  }
}
