import { NextResponse } from "next/server";
import { getRmaIdsFromAccessToken, getRolesFromAccessToken, getServerCognitoSession } from "@/lib/cognitoSession";

// Temporary Phase 1 verification route - confirms server-side code can read
// the Cognito session the browser's AuthModal creates. Delete once verified
// (see migration plan, Phase 1).
export async function GET() {
  const session = await getServerCognitoSession();

  return NextResponse.json({
    registerApiDomain: process.env.NEXT_PUBLIC_REGISTER_API_DOMAIN,
    hasSession: Boolean(session.accessToken),
    accessToken: session.accessToken,
    roles: getRolesFromAccessToken(session.accessToken),
    rmaIds: getRmaIdsFromAccessToken(session.accessToken),
  });
}
