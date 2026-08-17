export const claimsContent = {
  heading: "My Claims",
  tabs: ["Active Claims", "Past Claims"] as const,
  emptyState: "There are no claims to display in this category.",
};

export interface Claim {
  title: string;
  reference: string;
  eventDate: string;
  reportedDate: string;
  employee: string;
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
    title: claim.eventDescription,
    reference: claim.claimReferenceNumber,
    eventDate: formatDate(claim.eventDate),
    reportedDate: "-",
    employee: claim.claimantDisplayName,
    status: claim.claimStatus,
  };
}
