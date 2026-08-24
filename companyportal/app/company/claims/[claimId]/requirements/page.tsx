import DocumentUploadList from "@/components/claim-details/panels/DocumentUploadList";
import serverApiService from "@/lib/api/serverApiService";
import {
  getClaimDetails,
  mapApiDocuments,
  type ApiClaimDocument,
  type ClaimUploadDocument,
} from "@/content/claimDetails";

export default async function RequirementsPage({
  params,
}: {
  params: Promise<{ claimId: string }>;
}) {
  const { claimId } = await params;
  const claimantId = String(claimId);
  const mockClaim = getClaimDetails(claimantId);

  let requirements: ClaimUploadDocument[] = mockClaim.requirements;

  try {
    const documentsResponse = await serverApiService.get<ApiClaimDocument[]>(
      `/employer/documents/${claimantId}`,
    );
    requirements = mapApiDocuments(documentsResponse).requirements;
  } catch (error) {
    console.error("Failed to load claim requirements:", error);
  }

  return <DocumentUploadList title="Claim Requirements" documents={requirements} />;
}
