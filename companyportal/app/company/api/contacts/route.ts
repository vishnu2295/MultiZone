import { NextRequest, NextResponse } from "next/server";
import serverApiService from "@/lib/api/serverApiService";
import { apiErrorResponse } from "@/lib/api/routeHandlerError";
import { getEmployerCoidIdServer } from "@/lib/auth/employerClaims.server";

export async function PUT(request: NextRequest) {
  const { coidId } = await getEmployerCoidIdServer();
  if (!coidId) {
    return NextResponse.json({ error: "No employer found for the current user" }, { status: 403 });
  }

  const body = await request.json();

  try {
    const data = await serverApiService.put(`/employer/${coidId}/ContactDetails`, body);
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorResponse(error, "Failed to update contact");
  }
}
