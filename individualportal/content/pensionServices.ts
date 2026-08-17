// Mock data for the "Pension Services" screen in the individual flow.
// Replace with the real API responses once the endpoints are available.

export type PensionServiceAction = "link" | "download" | "modal";

export interface PensionServiceCard {
  id: "commutation-status" | "pension-confirmation-letter" | "child-pension-extension";
  icon: "monitor" | "document" | "users";
  title: string;
  /** Plain body copy. Mutually exclusive with `status`. */
  description?: string;
  /** Highlighted "label : value" line, used by Commutation Status. */
  status?: { label: string; value: string };
  /** Which affordance the round button in the card corner performs. */
  action: PensionServiceAction;
  /** Destination for `action: "link"` cards. */
  href?: string;
}

export const pensionServicesContent = {
  backLabel: "Back",
  backHref: "/individual",
  title: "Pension Services",
};

export const pensionServiceCards: PensionServiceCard[] = [
  {
    id: "commutation-status",
    icon: "monitor",
    title: "Commutation Status",
    status: {
      label: "Your commutation request status is",
      value: "Pending",
    },
    action: "link",
    // No commutation detail screen yet — point this at the route once it exists.
    href: "#",
  },
  {
    id: "pension-confirmation-letter",
    icon: "document",
    title: "Pension Confirmation Letter",
    description: "You can download your pension confirmation letter here.",
    action: "download",
  },
  {
    id: "child-pension-extension",
    icon: "users",
    title: "Child Pension Extension",
    description: "Check the current status of your child pension extension request.",
    action: "modal",
  },
];

export type ChildExtensionRequestStatus = "Accepted" | "Pending" | "Declined";

export interface ChildExtensionField {
  label: string;
  value: string;
}

/**
 * Detail shown in the "Child Extension Request Status" dialog. Fields are
 * grouped so the dialog can render a rule between the demographics block and
 * the payment block, as in the design.
 */
export const childExtensionRequest = {
  title: "Child Extension Request Status",
  status: "Accepted" as ChildExtensionRequestStatus,
  sectionTitle: "Demographics",
  groups: [
    [
      { label: "Reference No", value: "24859734" },
      { label: "Child Name", value: "John Doe" },
      { label: "ID Type", value: "SA ID" },
      { label: "ID/ Passport Number", value: "987538947523545" },
      { label: "Date of Birth", value: "1972-06-28" },
      { label: "Gender", value: "Male" },
      { label: "Guardian Name", value: "Jane Doe" },
      { label: "Relationship", value: "Mother" },
      { label: "Effective Date", value: "12-04-2026" },
    ],
    [
      { label: "Monthly Pension Amount", value: "R 3000.00" },
      { label: "Payment Frequency", value: "Monthly" },
      { label: "Nationality", value: "South African" },
      { label: "Country", value: "South Africa" },
    ],
  ] as ChildExtensionField[][],
};

/** Tailwind classes for the pill next to the dialog title, per status. */
export const childExtensionStatusStyle: Record<
  ChildExtensionRequestStatus,
  string
> = {
  Accepted: "bg-[#CDE8A0] text-[#11252D]",
  Pending: "bg-[#FBE6B4] text-[#11252D]",
  Declined: "bg-[#F6CFCB] text-[#11252D]",
};
