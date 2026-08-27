import { NextRequest, NextResponse } from "next/server";
import serverApiService from "@/lib/api/serverApiService";
import { apiErrorResponse } from "@/lib/api/routeHandlerError";
import { getSelectedRolePlayerIdServer } from "@/lib/auth/employerClaims.server";
import type { ApiClaim } from "@/content/claims";

/**
 * Proxies GET /employer/claim/{claimReferenceNumber}, which requires the
 * acting employer's rolePlayerId (not the claim's own rolePlayerId/claimantId)
 * as a query param, sourced from the user's selected switch-profile entry.
 */
export async function GET(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get("ref");
  if (!ref) {
    return NextResponse.json({ error: "Missing ref query param" }, { status: 400 });
  }

  const { rolePlayerId } = await getSelectedRolePlayerIdServer();
  if (!rolePlayerId) {
    return NextResponse.json({ error: "No employer found for the current user" }, { status: 403 });
  }

  try {
    const claim = await serverApiService.get<ApiClaim>(
      `/employer/claim/${encodeURIComponent(ref)}`,
      { params: { rolePlayerId } },
    );

    return NextResponse.json(claim);
  } catch (error) {
    return apiErrorResponse(error, "Failed to load claim");
  }
}
