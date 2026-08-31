
export const individualNavItems = [
  { label: "Claims", href: "/individual/claims" },
  { label: "Pension Ledgers", href: "/individual/pension-services" },
  // { label: "Customer Care", href: "/customer-care" },
  // { label: "FAQs", href: "/faq" },
];

/** Details shown in the "My Profile" dropdown in the navbar. */
export const profileMenu = {
  name: "",
  email: "",
  /** Falls back to initials derived from `name` when omitted. */
  initials: "",
  logoutLabel: "Logout",
  logoutHref: "/auth/logout",
};

export interface ApiProfileResponse {
  isValidUser: boolean;
  employeeDetails: { employeeNumber: string } | null;
  pensionerDetails: unknown | null;
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

export interface ProfileSummary {
  name: string;
  email: string;
}

const checkValueExists = (value: string | undefined | null): string =>
  value && value.trim() ? value : "N/A";

export function mapProfile(response: ApiProfileResponse): ProfileSummary {
  const { firstName, lastName, email } = response.userDetails;
  const name = [firstName, lastName].filter(Boolean).join(" ").trim();

  return {
    name: checkValueExists(name),
    email: checkValueExists(email),
  };
}

export const homeContent = {
  brand: "Individual Portal",
  navLinks: individualNavItems,
  profileLabel: "My Profile",
  greeting: "Good Morning,",
  memberName: "",
  // Employer/scheme line shown under the member name on the dashboard.
  organisation: "",
  welcomeMessage:
    "Welcome to your individual portal, you can manage your insurance, claims, and documents - all in one place.",
  quickActionsLabel: "Quick Actions",
  quickActions: [
    {
      icon: "document" as const,
      title: "My Claims",
      description:
        "Track your submitted claims, view their status, and review claim history.",
      href: "/individual/claims",
      highlighted: false,
    },
    {
      icon: "users" as const,
      title: "Pension Ledgers",
      description:
        "Access your pension ledgers, details, commutation status, confirmation letters, and child pension extensions.",
      href: "/individual/pension-services",
      highlighted: true,
    },
    {
      icon: "shield" as const,
      title: "Medical Authorizations",
      description:
        "Review your pre-authorizations and track whether each one is pending or authorised.",
      href: "/individual/medical-authorizations",
      highlighted: false,
    },
  ],
};
