import EarningsPanel from "@/components/claim-details/panels/EarningsPanel";
import serverApiService from "@/lib/api/serverApiService";
import {
  getClaimDetails,
  mapApiEarnings,
  type ApiEarningsRecord,
  type ClaimEarningsRecord,
} from "@/content/claimDetails";

export default async function EarningsPage({
  params,
}: {
  params: Promise<{ claimId: string }>;
}) {
  const { claimId } = await params;
  const claimantId = String(claimId);
  const mockClaim = getClaimDetails(claimantId);

  let earnings: ClaimEarningsRecord[] = mockClaim.earnings;

  try {
    const earningsResponse = await serverApiService.get<ApiEarningsRecord[]>(
      `/employer/earnings/${claimantId}`,
    );
    earnings = mapApiEarnings(earningsResponse);
  } catch (error) {
    console.error("Failed to load earnings:", error);
  }

  return (
    <EarningsPanel earnings={earnings} documents={mockClaim.earningsDocuments} />
  );
}
