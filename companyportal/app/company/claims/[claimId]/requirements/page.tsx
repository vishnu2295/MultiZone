import DocumentUploadList from "@/components/claim-details/panels/DocumentUploadList";
import apiService from "@/lib/api/apiService";
import { auth0 } from "@/lib/auth0";
import {
  // getClaimDetails,
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

  let requirements: ClaimUploadDocument[] = [];

  try {
    const { token } = await auth0.getAccessToken();
    const documentsResponse = await apiService.get<ApiClaimDocument[]>(
      `/employer/documents/${claimantId}`,
      { token },
    );
    console.log("documentsResponse", documentsResponse);
    requirements = mapApiDocuments(documentsResponse).requirements;
  } catch (error) {
    console.error("Failed to load claim requirements:", error);
  }

  return (
    <DocumentUploadList title="Claim Requirements" documents={requirements} />
  );
}
