export const claimsContent = {
  heading: "My Claims",
  emptyState: "You have no claims to display.",
};

export interface Claim {
  title: string;
  refNo: string;
  eventDate: string;
  dateReported: string;
  status: string;
}

export interface ApiClaim {
  rolePlayerId: number;
  claimId: number;
  claimReferenceNumber: string;
  claimLiabilityStatusId: number;
  claimStatus: string;
  eventDate: string;
  eventDescription: string;
  claimantId: number;
  claimantDisplayName: string;
  natureOfInjury: string;
  preAuthorizationId: number;
  isTTDClaim: boolean;
  isPDClaim: boolean;
  disabilityPercentage: number;
}

export interface ApiClaimsResponse {
  data: ApiClaim[];
  rowCount: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

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

export function mapApiClaim(claim: ApiClaim): Claim {
  return {
    title: checkValueExists(claim.eventDescription),
    refNo: checkValueExists(claim.claimReferenceNumber),
    eventDate: formatDate(claim.eventDate),
    dateReported: "N/A",
    status: checkValueExists(claim.claimStatus),
  };
}
