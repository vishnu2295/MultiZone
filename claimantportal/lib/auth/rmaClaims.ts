// Pure parsing of the rma_* claims on the Cognito access token. No
// auth-library imports, so proxy.ts, server code and client components can
// all use it. The backend's Pre-Token-Generation Lambda adds them as arrays:
//   "https://rma.com/claims/rma_roles": ["Organization"]
//   "https://rma.com/claims/rma_ids": [{ "CoidId": "142277", "Role": "Organization", ... }]

const RMA_ROLES_CLAIM = "https://rma.com/claims/rma_roles";
const RMA_IDS_CLAIM = "https://rma.com/claims/rma_ids";

export interface RmaId {
  coidId?: string;
  role?: string;
}

function asArray(raw: unknown): unknown[] {
  return Array.isArray(raw) ? raw : [];
}

export function getRmaRoles(accessTokenClaims: Record<string, unknown> | undefined): string[] {
  return asArray(accessTokenClaims?.[RMA_ROLES_CLAIM]).filter(
    (role): role is string => typeof role === "string",
  );
}

/** rma_ids entries, normalised from the claim's PascalCase keys. */
export function getRmaIds(accessTokenClaims: Record<string, unknown> | undefined): RmaId[] {
  return asArray(accessTokenClaims?.[RMA_IDS_CLAIM]).map((entry) => {
    const { CoidId, Role } = (entry ?? {}) as { CoidId?: unknown; Role?: unknown };
    return {
      coidId: CoidId == null ? undefined : String(CoidId),
      role: typeof Role === "string" ? Role : undefined,
    };
  });
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

/**
 * Buckets an rma_ids role string into "individual" or "organization". Matches
 * on keywords rather than an exact enum ("Organization"/"Individual" today,
 * but "Employer"/"Employee" etc. are accepted too) - adjust the keyword lists
 * if real role values turn out to differ.
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
