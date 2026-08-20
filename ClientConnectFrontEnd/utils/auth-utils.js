// Shared authentication utilities

export const normalizeRole = (role) => 
  role ? role.toLowerCase().replace(/[\s-]/g, "") : "";

export const CLIENT_CONNECT_ROLES = [
  "CDA-RMA-Policy Admin",
  "CDA-RMA-User Admin",
  "CDA-BROKERAGE-Broker Manager",
  "CDA-SCHEME-Scheme Representative",
  "new-Broker-onboarding-user",
  "CDA-BROKERAGE-Broker Representative"
];

//Access to both Client Connect and Group Life Broker Portal
export const DUAL_PORTAL_ROLES = ["CC_BP_REP"];

export const ADMIN_PORTAL_ROLES = [
  "SYSTEM_ADMIN",
  "POLICY_ADMIN",
  "NEW_BUSINESS_ADMIN",
  "CLAIMS_ADMIN",
  "COLLECTIONS_ADMIN",
  "COMMISSION_ADMIN",
  "RETENTIONS_ADMIN",
  "SENIOR_APPROVER",
];

export const BROKER_PORTAL_ROLES = ["BP_BROKER_REP"];

export const checkUserRole = (roles) => {
  const normalizedRoles = roles.map(normalizeRole);
  
  const isAdministrator = normalizedRoles.includes("administrator");
  const isBrokerRep = BROKER_PORTAL_ROLES.some(role => 
    normalizedRoles.includes(normalizeRole(role))
  );
  const hasAdminPortalRole = ADMIN_PORTAL_ROLES.some(role =>
    normalizedRoles.includes(normalizeRole(role))
  );
  const hasClientConnectRole = CLIENT_CONNECT_ROLES.some(role =>
    normalizedRoles.includes(normalizeRole(role))
  );
  const hasDualPortalAccess=DUAL_PORTAL_ROLES.some(role=>
    normalizedRoles.includes(normalizeRole(role))
  );

  return {
    isAdministrator,
    isBrokerRep,
    hasAdminPortalRole,
    hasClientConnectRole,
    hasDualPortalAccess,
    normalizedRoles
  };
};