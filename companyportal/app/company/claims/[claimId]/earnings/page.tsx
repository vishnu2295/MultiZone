import EarningsPanel from "@/components/claim-details/panels/EarningsPanel";
<<<<<<< Updated upstream
=======
import serverApiService from "@/lib/api/serverApiService";
import {
  ApiClaimDocument,
  ClaimDocumentGroup,
  ClaimUploadDocument,
  mapEarningsDocuments,
  // getClaimDetails,
  mapApiEarnings,
  type ApiEarningsRecord,
  type ClaimEarningsRecord,
} from "@/content/claimDetails";
>>>>>>> Stashed changes

export default async function EarningsPage({
  params,
}: {
  params: Promise<{ claimId: string }>;
}) {
  const { claimId } = await params;
<<<<<<< Updated upstream

  return <EarningsPanel claimId={String(claimId)} />;
=======
  const claimantId = String(claimId);
  let earnings: ClaimEarningsRecord[] = [];
  let documentGroups: ClaimUploadDocument[] = mapEarningsDocuments([]);

  try {
    const earningsResponse = await serverApiService.get<ApiEarningsRecord[]>(
      `/employer/earnings/${claimantId}`,
    );
    console.log("earnings", earningsResponse);
    earnings = mapApiEarnings(earningsResponse);
    const documentsResponse = await serverApiService.get<ApiClaimDocument[]>(
      `/employer/documents/${claimantId}`,
    );
    documentGroups = mapEarningsDocuments(documentsResponse);
  } catch (error) {
    console.error("Failed to load earnings:", error);
  }

  return <EarningsPanel earnings={earnings} documents={documentGroups} claimId={claimantId} />;
>>>>>>> Stashed changes
}
