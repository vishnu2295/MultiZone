// Mock data for the "Medical Authorizations" screen in the individual flow.
// Replace with the real API response once the endpoint is available.

export type MedicalAuthorizationStatus =
  | "Pending"
  | "Authorised"
  | "Declined";

export interface MedicalAuthorization {
  id: string;
  title: string;
  /** Pre-authorization number issued by the insurer. */
  preAuthNo: string;
  claimRefNo: string;
  eventDate: string;
  dateReported: string;
  status: MedicalAuthorizationStatus;
}

export const medicalAuthorizationsContent = {
  backLabel: "Back",
  backHref: "/individual",
  title: "Medical Authorizations",
  statusLabel: "Status",
  emptyMessage: "You have no medical authorizations yet.",
};

/** Tailwind text colour per status, used by the status column on each card. */
export const medicalAuthorizationStatusColor: Record<
  MedicalAuthorizationStatus,
  string
> = {
  Pending: "text-[#E0A527]",
  Authorised: "text-[#3F9142]",
  Declined: "text-[#C0392B]",
};

export const medicalAuthorizations: MedicalAuthorization[] = [
  {
    id: "auth-1",
    title: "Workplace Accident Claim",
    preAuthNo: "CLM-2024-003",
    claimRefNo: "CLM-2024-003",
    eventDate: "Mar 10, 2024",
    dateReported: "Jul 10, 2026",
    status: "Pending",
  },
  {
    id: "auth-2",
    title: "Workplace Accident Claim",
    preAuthNo: "CLM-2024-003",
    claimRefNo: "CLM-2024-003",
    eventDate: "Mar 10, 2024",
    dateReported: "Jul 10, 2026",
    status: "Authorised",
  },
];
