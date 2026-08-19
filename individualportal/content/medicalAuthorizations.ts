export interface MedicalAuthorization {
  title: string;
  preAuthNo: string;
  claimRefNo: string;
  eventDate: string;
  dateReported: string;
  status: string;
}

export interface ApiPreAuthorization {
  preAuthId: number;
  preAuthNumber: string;
  claimId: number;
  dateAuthorisedFrom: string;
  dateAuthorisedTo: string;
  dateAuthorised: string;
  preAuthType: string;
  preAuthStatus: string;
  requestedAmount: number;
  authorisedAmount: number;
  claimReferenceNumber: string;
  employeeName: string;
  injury: string;
}

export interface ApiPreAuthorizationsResponse {
  data: ApiPreAuthorization[];
  rowCount: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export const medicalAuthorizationsContent = {
  backLabel: "Back",
  backHref: "/individual",
  title: "Medical Authorizations",
  statusLabel: "Status",
  emptyMessage: "You have no medical authorizations yet.",
};

/** Tailwind text colour per status, used by the status column on each card. */
export const medicalAuthorizationStatusColor: Record<string, string> = {
  Pending: "text-[#E0A527]",
  Approved: "text-[#3F9142]",
  Rejected: "text-[#C0392B]",
};

const checkValueExists = (value: string | undefined | null): string =>
  value && value.trim() ? value : "N/A";

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function mapApiPreAuthorization(
  api: ApiPreAuthorization,
): MedicalAuthorization {
  return {
    title: checkValueExists(api.injury),
    preAuthNo: checkValueExists(api.preAuthNumber),
    claimRefNo: checkValueExists(api.claimReferenceNumber),
    eventDate: formatDate(api.dateAuthorisedFrom),
    dateReported: formatDate(api.dateAuthorised),
    status: checkValueExists(api.preAuthStatus),
  };
}
