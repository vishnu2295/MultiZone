// Client-safe role helpers, shared by proxy.ts (server) and the auth modal
// (browser). Kept free of server-only imports (next/headers) so client
// components can import this directly.

// Role required to access each zone. A member can hold both roles (e.g. an
// Organization admin who is also an Individual member) and gets both zones -
// this is a membership check per zone, not a single computed "home".
export const ZONE_ROLES: Record<string, string> = {
  "/company": "Organization",
  "/individual": "Individual",
};

// Takes an already-resolved roles array (see getRolesFromAccessToken below).
export function canAccessZone(roles: string[], zone: string): boolean {
  const requiredRole = ZONE_ROLES[zone];
  if (!requiredRole) return true;
  return roles.includes(requiredRole);
}

// Default zone to land a member on right after login or when they hit "/" -
// used only to pick one starting point for someone with multiple roles, not
// to gate access (see canAccessZone for that).
export function getRoleHomePath(roles: string[]): string | null {
  if (roles.includes("Organization")) return "/company";
  if (roles.includes("Individual")) return "/individual";
  return null;
}

// The backend's Pre-Token-Generation Lambda adds the roles to the Cognito
// access token as an array, e.g. "https://rma.com/claims/rma_roles": ["Organization"].
const RMA_ROLES_CLAIM = "https://rma.com/claims/rma_roles";

export function getRolesFromAccessToken(accessToken: Record<string, unknown> | undefined): string[] {
  const raw = accessToken?.[RMA_ROLES_CLAIM];
  return Array.isArray(raw) ? raw.filter((role): role is string => typeof role === "string") : [];
}
