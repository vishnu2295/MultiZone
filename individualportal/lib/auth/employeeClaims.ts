import { getAccessToken } from "@auth0/nextjs-auth0";

export function decodeJwtPayload(token: string): Record<string, unknown> {
  const payload = token.split(".")[1];
  const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
  const json = decodeURIComponent(
    atob(base64)
      .split("")
      .map((char) => "%" + char.charCodeAt(0).toString(16).padStart(2, "0"))
      .join(""),
  );
  return JSON.parse(json);
}

export interface RmaId {
  coidId?: string;
  role?: string;
}

/**
 * Picks the rma_ids entry matching the given role bucket. A user with both an
 * organization and an individual profile has both entries in the array in no
 * guaranteed order, so callers must filter by role rather than assume [0].
 */
export function findRmaId(
  rmaIds: RmaId[],
  role: "individual" | "organization",
): RmaId | undefined {
  return rmaIds.find((entry) => classifyRmaRole(entry.role) === role);
}

/** Access token plus the employee coidId pulled from the rma_ids claim. */
export async function getEmployeeCoidId(): Promise<{
  token: string;
  coidId: string | undefined;
}> {
  const token = await getAccessToken();
  const claims = decodeJwtPayload(token);
  const rmaIds =
    (claims[process.env.NEXT_PUBLIC_AUTH0_IDENTIFIER as string] as
      | RmaId[]
      | undefined) ?? [];

  return { token, coidId: findRmaId(rmaIds, "individual")?.coidId };
}

/**
 * Buckets an rma_ids role string into "individual" or "organization". The
 * exact role values Auth0 issues aren't documented anywhere in this repo, so
 * this matches on the terms both zones already use ("Employee"/"Employer"
 * etc.) rather than an exact enum - adjust the keyword lists if real role
 * values turn out to differ. Mirrors companyportal's employerClaims.ts.
 */
export function classifyRmaRole(role: string | undefined): "individual" | "organization" | "unknown" {
  const value = (role ?? "").toLowerCase();

  if (
    value.includes("employer") ||
    value.includes("organisation") ||
    value.includes("organization") ||
    value.includes("company")
  ) {
    return "organization";
  }

  if (
    value.includes("employee") ||
    value.includes("individual") ||
    value.includes("pensioner") ||
    value.includes("member")
  ) {
    return "individual";
  }

  return "unknown";
}
