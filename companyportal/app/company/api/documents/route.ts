import { NextRequest, NextResponse } from "next/server";
import serverApiService from "@/lib/api/serverApiService";
import { apiErrorResponse } from "@/lib/api/routeHandlerError";
import { getSelectedRolePlayerIdServer } from "@/lib/auth/employerClaims.server";

export async function POST(request: NextRequest) {
  const { rolePlayerId } = await getSelectedRolePlayerIdServer();
  if (!rolePlayerId) {
    return NextResponse.json({ error: "No employer found for the current user" }, { status: 403 });
  }

  const formData = await request.formData();

  try {
    const data = await serverApiService.post(`/employer/${rolePlayerId}/saveDocuments`, formData);
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorResponse(error, "Failed to upload document");
  }
}
