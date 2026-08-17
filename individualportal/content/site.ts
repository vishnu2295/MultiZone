// Single source of truth for the individual portal navbar links — used by the
// shared Navbar on every individual screen (dashboard and IndividualBackground
// pages alike). The trailing "My Profile" dropdown is not a link; it comes from
// `profileLabel` below.
export const individualNavItems = [
  { label: "Claims", href: "/individual/claims" },
  { label: "Pension Services", href: "/individual/pension-services" },
  { label: "Customer Care", href: "/customer-care" },
  { label: "FAQs", href: "/faq" },
];

export const homeContent = {
  brand: "Individual Portal",
  navLinks: individualNavItems,
  profileLabel: "My Profile",
  greeting: "Good Morning,",
  memberName: "John Doe",
  welcomeMessage:
    "Welcome to your individual portal, you can manage your insurance, claims, and documents — all in one place.",
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
      title: "Pensioner Services",
      description:
        "View your commutation status, download your pension confirmation letter, and track child pension extensions.",
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
