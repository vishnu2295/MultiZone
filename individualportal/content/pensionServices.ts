// Mock data for the "Pension Services" screen in the individual flow.
// Replace with the real API responses once the endpoints are available.

import { API_ROOT_BASE_URL } from "@/lib/api/apiService";

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

// commutationDetails/confirmationLetter/childPensionExtensionDetails live
// under /pensioner, not /coid like the rest of the mobileApp API.
export const PENSIONER_API_BASE_URL = API_ROOT_BASE_URL;

export interface ApiCommutationDetails {
  pensionNumber: string;
  requestReferenceNumber: string;
  requestedAmount: number;
  status: string;
  requestedDate: string;
  approvedDate: string | null;
  rejectionReason: string | null;
}

const checkValueExists = (value: string | undefined | null): string =>
  value && value.trim() ? value : "N/A";

export function mapCommutationStatus(details: ApiCommutationDetails): string {
  return checkValueExists(details.status);
}

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

export interface ChildExtensionField {
  label: string;
  value: string;
}

/** Static copy for the "Child Extension Request Status" dialog. */
export const childExtensionModalContent = {
  title: "Child Extension Request Status",
  sectionTitle: "Demographics",
};

export interface ApiChildPensionExtensionDetails {
  pensionCaseNumber: string;
  childName: string;
  dateOfBirth: string;
  guardianName: string;
  relationship: string;
  pensionStatus: string;
  effectiveDate: string;
  monthlyPensionAmount: number;
  paymentFrequency: string;
}

function formatShortDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Maps the childPensionExtensionDetails response to the status pill plus the
 * field groups shown in the dialog. Fields are grouped so the dialog can
 * render a rule between the demographics block and the payment block, as in
 * the design.
 */
export function mapChildPensionExtensionDetails(
  details: ApiChildPensionExtensionDetails,
): { status: string; groups: ChildExtensionField[][] } {
  return {
    status: checkValueExists(details.pensionStatus),
    groups: [
      [
        {
          label: "Reference No",
          value: checkValueExists(details.pensionCaseNumber),
        },
        { label: "Child Name", value: checkValueExists(details.childName) },
        { label: "Date of Birth", value: formatShortDate(details.dateOfBirth) },
        {
          label: "Guardian Name",
          value: checkValueExists(details.guardianName),
        },
        { label: "Relationship", value: checkValueExists(details.relationship) },
        {
          label: "Effective Date",
          value: formatShortDate(details.effectiveDate),
        },
      ],
      [
        {
          label: "Monthly Pension Amount",
          value: `R ${details.monthlyPensionAmount.toFixed(2)}`,
        },
        {
          label: "Payment Frequency",
          value: checkValueExists(details.paymentFrequency),
        },
      ],
    ],
  };
}

/** Tailwind classes for the pill next to the dialog title, per status. */
export const childExtensionStatusStyle: Record<string, string> = {
  Accepted: "bg-[#CDE8A0] text-[#11252D]",
  Active: "bg-[#CDE8A0] text-[#11252D]",
  Pending: "bg-[#FBE6B4] text-[#11252D]",
  Declined: "bg-[#F6CFCB] text-[#11252D]",
  Inactive: "bg-[#F6CFCB] text-[#11252D]",
};

export const childExtensionStatusFallbackStyle = "bg-[#EEF3F7] text-[#11252D]";
