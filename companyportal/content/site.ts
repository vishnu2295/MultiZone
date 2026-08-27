export const siteContent = {
  navLinks: [
    // { label: "Customer Care", href: "#" },
    // { label: "Faq's", href: "#" },
    { label: "Go to randmutual.co.za", href: "https://www.randmutual.co.za" },
  ],
  primaryCta: "Proceed to Login",
  secondaryCtaPrefix: "New here ?",
  secondaryCta: "Sign up",
  heroTitle: "Welcome to RMA",
  heroTitleAccent: "Client Portal",
  heroDescription:
    "Everything you need to manage your insurance —claims, policies, documents, benefits, and more, all in one secure place.",
  loginButton: "Login / Register",
};

/** Details shown in the "My Profile" dropdown in the navbar. */
export const profileMenu = {
  name: "John Doe",
  email: "john@gmail.com",
  /** Falls back to initials derived from `name` when omitted. */
  initials: "JD",
  switchProfileLabel: "Switch Profile",
  logoutLabel: "Logout",
  logoutHref: "/auth/logout",
};

export interface ApiOrganizationProfileResponse {
  isValidUser: boolean;
  hcpDetails: unknown[];
  employerDetails: Array<{
    memberNumber: string;
    status: string;
    memberName: string;
    joinDate: string;
    clientType: string;
    medicalBenefitWaitingPeriod: string;
    rolePlayerId: number;
  }>;
  userDetails: {
    idNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    userRoles: string[];
    coidId: number;
    funeralId: number | null;
    groupRiskId: number | null;
    prmaId: number | null;
  };
}

export interface OrganizationProfileSummary {
  name: string;
  email: string;
  memberName: string | null;
}

/** One switchable entry in the "Switch Profile" list, sourced from `employerDetails`. */
export interface EmployerProfileOption {
  rolePlayerId: number;
  memberNumber: string;
  memberName: string;
}

const checkValueExists = (value: string | undefined | null): string =>
  value && value.trim() ? value : "N/A";

export function mapOrganizationProfile(
  response: ApiOrganizationProfileResponse,
): OrganizationProfileSummary {
  const { firstName, lastName, email } = response.userDetails;
  const name = [firstName, lastName].filter(Boolean).join(" ").trim();

  return {
    name: checkValueExists(name),
    email: checkValueExists(email),
    memberName: response.employerDetails[0]?.memberName ?? null,
  };
}

/** Every employer/company membership the org user can switch between. */
export function mapEmployerProfiles(
  response: ApiOrganizationProfileResponse,
): EmployerProfileOption[] {
  return response.employerDetails.map((employer) => ({
    rolePlayerId: employer.rolePlayerId,
    memberNumber: employer.memberNumber,
    memberName: employer.memberName,
  }));
}

export const homeContent = {
  brand: "Company Portal",
  navLinks: [
    // { label: "My Policy", href: "#" },
    // { label: "Report an Incident", href: "#" },
    { label: "Claims", href: "/company/claims" },
    // { label: "Customer Care", href: "#" },
    // { label: "Faq's", href: "#" },
  ],
  profileLabel: "My Profile",
  greeting: "Good Morning,",
  memberName: "Impala Platinum Limited",
  welcomeMessage:
    "Welcome to member portal, you can manage your insurance, claims, and documents — all in one place.",
  quickActionsLabel: "Quick Actions",
  quickActions: [
    {
      icon: "shield" as const,
      title: "Policy Details",
      description:
        "View your policies, coverage details, benefits, premiums, and policy documents in one place.",
      href: "/company/policies",
      highlighted: false,
    },
    {
      icon: "building" as const,
      title: "Company Details",
      description:
        "Access your company details such as addresses, back accounts, members etc.",
      href: "/company/company-details",
      highlighted: true,
    },
    {
      icon: "document" as const,
      title: "My Claims",
      description:
        "Track your submitted claims, view their status, and review claim history.",
      href: "/company/claims",
      highlighted: false,
    },
    // {
    //   icon: "question" as const,
    //   title: "General Enquiry",
    //   description: "All your queries are answered here.",
    //   href: "#",
    //   highlighted: false,
    // },
  ],
};

export const myClaimsContent = {
  tabs: ["Active Claims", "Past Claims"] as const,
  claims: [
    {
      id: "CLM-2024-003",
      title: "Workplace Accident Claim",
      reference: "CLM-2024-003",
      eventDate: "Mar 10, 2024",
      reportedDate: "Jul 10, 2026",
      employee: "John Andrew Doe (8212051392372)",
      status: "Pending",
    },
    {
      id: "CLM-2024-004",
      title: "Workplace Accident Claim",
      reference: "CLM-2024-004",
      eventDate: "Mar 10, 2024",
      reportedDate: "Jul 10, 2026",
      employee: "John Andrew Doe (8212051392372)",
      status: "Completed",
    },
  ],
};
