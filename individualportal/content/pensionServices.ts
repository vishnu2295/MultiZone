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
  title: "Pension Ledgers",
};

// commutationDetails/confirmationLetter/childPensionExtensionDetails live
// under /pensioner, not /coid like the rest of the mobileApp API.
export const PENSIONER_API_BASE_URL = API_ROOT_BASE_URL;

const checkValueExists = (value: string | undefined | null): string =>
  value && value.trim() ? value : "N/A";

export interface ApiCommutationValidation {
  isEligible: boolean;
  totalAllowableCommuteAmount: number;
  totalCommutationAmountUsed: number;
  availableAllowableCommutableAmount: number;
}

export interface ApiCommutationDocument {
  fileName: string;
  contentType: string;
  base64Content: string;
}

export interface CommutationEligibility {
  isEligible: boolean;
  availableAmount: string;
}

function formatCurrency(value: number): string {
  return `R ${value.toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function mapCommutationValidation(
  details: ApiCommutationValidation,
): CommutationEligibility {
  return {
    isEligible: details.isEligible,
    availableAmount: formatCurrency(details.availableAllowableCommutableAmount),
  };
}

export const commutationStatusModalContent = {
  title: "Commutation Status",
  sectionTitle: "Commutation Details",
};

/** Maps the commutation/validate response to the status pill plus the field grid shown in the dialog. */
export function mapCommutationValidationDetails(
  details: ApiCommutationValidation,
): { status: string; fields: Array<{ label: string; value: string }> } {
  return {
    status: details.isEligible ? "Eligible" : "Not Eligible",
    fields: [
      {
        label: "Total Allowable Commute Amount",
        value: formatCurrency(details.totalAllowableCommuteAmount),
      },
      {
        label: "Total Commutation Amount Used",
        value: formatCurrency(details.totalCommutationAmountUsed),
      },
      {
        label: "Available Allowable Commutable Amount",
        value: formatCurrency(details.availableAllowableCommutableAmount),
      },
    ],
  };
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
    // No commutation detail screen yet - point this at the route once it exists.
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
    description:
      "Check the current status of your child pension extension request.",
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
        {
          label: "Relationship",
          value: checkValueExists(details.relationship),
        },
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
  Accepted: "bg-[#10AD5EE5] text-[#FFFFFF]",
  Active: "bg-[#10AD5EE5] text-[#FFFFFF]",
  Running: "bg-[#10AD5EE5] text-[#FFFFFF]",
  Pending: "bg-[#FBE6B4] text-[#11252D]",
  Declined: "bg-[#F6CFCB] text-[#11252D]",
  Inactive: "bg-[#F6CFCB] text-[#11252D]",
  Closed: "bg-[#F6CFCB] text-[#11252D]",
};

export const childExtensionStatusFallbackStyle = "bg-[#EEF3F7] text-[#11252D]";

export interface PensionLedgerMetric {
  label: string;
  value: string;
}

export interface PensionLedgerEntry {
  id: string;
  claimantName: string;
  status: string;
  pensionCase: string;
  claimRefNo: string;
  benefit: string;
  recipient: string;
  metrics: PensionLedgerMetric[];
  /** Raw identifiers needed by the confirmationLetter download request body. */
  pensionCaseId: number;
  ledgerRecipientId: number;
  recipientDisplayName: string;
}

/** Static copy for the pension ledger card. */
export const pensionLedgerCardContent = {
  hideDetailsLabel: "Hide Details",
  showDetailsLabel: "Show Details",
  pensionCaseLabel: "Pension Case",
  claimRefNoLabel: "Claim Ref No",
  benefitLabel: "Benefit",
  recipientLabel: "Recipient",
  actions: {
    confirmationLetter: "Pension Confirmation Letter",
    commutationForms: "Pension Commutation Forms",
    commutationStatus: "Commutation Status",
    childPensionStatus: "Child Pension Request Status",
  },
};

export interface ApiPensionLedgerEntry {
  pensionLedgerId: number;
  pensionCaseId: number;
  ledgerRecipientId: number;
  pensionCaseNumber: string;
  recipientDisplayName: string;
  claimReferenceNumber: string;
  pensionType: string;
  pdPercentage: number;
  estimatedCV: number;
  verifiedCV: number;
  status: string;
  startDate: string;
  effectiveDate: string;
  normalMonthlyPension: number;
  currentMonthlyPension: number;
  capitalValue: number;
  earnings: number;
  productCode: string | null;
  benefitCode: string | null;
  dateOfStabilisation: string;
  statusReason: string | null;
  beneficiaryDisplayName: string | null;
}

export interface ApiPensionLedgersResponse {
  data: ApiPensionLedgerEntry[];
  rowCount: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

/** The API sends this .NET default-date sentinel for dates that were never set. */
const UNSET_DATE = "0001-01-01T00:00:00";

function formatLedgerDate(value: string): string {
  if (!value || value === UNSET_DATE) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function mapApiPensionLedgerEntry(
  entry: ApiPensionLedgerEntry,
): PensionLedgerEntry {
  return {
    id: String(entry.pensionLedgerId),
    claimantName: checkValueExists(entry.recipientDisplayName),
    status: checkValueExists(entry.status),
    pensionCase: checkValueExists(entry.pensionCaseNumber),
    claimRefNo: checkValueExists(entry.claimReferenceNumber),
    benefit: checkValueExists(entry.pensionType),
    recipient: checkValueExists(
      entry.beneficiaryDisplayName ?? entry.recipientDisplayName,
    ),
    metrics: [
      { label: "N.M.P", value: formatCurrency(entry.normalMonthlyPension) },
      { label: "C.M.P", value: formatCurrency(entry.currentMonthlyPension) },
      { label: "Start Date", value: formatLedgerDate(entry.startDate) },
      { label: "Effective Date", value: formatLedgerDate(entry.effectiveDate) },
      {
        label: "Stabilization Date",
        value: formatLedgerDate(entry.dateOfStabilisation),
      },
    ],
    pensionCaseId: entry.pensionCaseId,
    ledgerRecipientId: entry.ledgerRecipientId,
    recipientDisplayName: entry.recipientDisplayName,
  };
}

export function mapApiPensionLedgers(
  response: ApiPensionLedgersResponse,
): PensionLedgerEntry[] {
  return (response.data ?? []).map(mapApiPensionLedgerEntry);
}
