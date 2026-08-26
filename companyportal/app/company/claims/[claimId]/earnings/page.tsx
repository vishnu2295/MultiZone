import EarningsPanel from "@/components/claim-details/panels/EarningsPanel";
import serverApiService from "@/lib/api/serverApiService";
import {
  ApiClaimDocument,
  ClaimDocumentGroup,
  ClaimUploadDocument,
  mapApiDocuments,
  // getClaimDetails,
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
  let earnings: ClaimEarningsRecord[] = [];
  let documentGroups: ClaimUploadDocument[] = [];

  try {
    const earningsResponse = await serverApiService.get<ApiEarningsRecord[]>(
      `/employer/earnings/${claimantId}`,
    );
    earnings = mapApiEarnings(earningsResponse);
    const documentsResponse = await serverApiService.get<ApiClaimDocument[]>(
      `/employer/documents/${claimantId}`,
    );
    documentGroups = mapApiDocuments(documentsResponse).earningDocuments ??[];
  } catch (error) {
    console.error("Failed to load earnings:", error);
  }

  return <EarningsPanel earnings={earnings} documents={documentGroups} />;
}
