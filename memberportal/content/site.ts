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
  // Broker is rewritten to the external broker portal (see next.config.ts).
  // The rest go through the Auth0 login flow mounted at /auth/login.
  loginOptions: [
    { label: "Broker", href: "/broker" },
    { label: "Employee", href: "/auth/login" },
    { label: "Employer", href: "/auth/login" },
    { label: "HCP", href: "/auth/login" },
  ],
};

export const homeContent = {
  brand: "Company Portal",
  navLinks: [
    { label: "My Policy", href: "#" },
    { label: "Report an Incident", href: "#" },
    { label: "Claims", href: "#" },
    { label: "Customer Care", href: "#" },
    { label: "Faq's", href: "#" },
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
    {
      icon: "question" as const,
      title: "General Enquiry",
      description: "All your queries are answered here.",
      href: "#",
      highlighted: false,
    },
  ],
};

export const myClaimsContent = {
  tabs: ["Active Claims", "Past Claims"] as const,
  claims: [
    {
      title: "Workplace Accident Claim",
      reference: "CLM-2024-003",
      eventDate: "Mar 10, 2024",
      reportedDate: "Jul 10, 2026",
      employee: "John Andrew Doe (8212051392372)",
      status: "Pending",
    },
    {
      title: "Workplace Accident Claim",
      reference: "CLM-2024-003",
      eventDate: "Mar 10, 2024",
      reportedDate: "Jul 10, 2026",
      employee: "John Andrew Doe (8212051392372)",
      status: "Completed",
    },
  ],
};
