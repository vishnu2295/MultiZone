import DocumentsPanel from "@/components/claim-details/panels/DocumentsPanel";
import serverApiService from "@/lib/api/serverApiService";
import {
  ApiClaimantDetailsResponse,
  mapApiDocuments,
  type ApiClaimDocument,
  type ClaimDocumentGroup,
} from "@/content/claimDetails";

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ claimId: string }>;
}) {
  const { claimId } = await params;
  const claimantId = String(claimId);
  let documentGroups: ClaimDocumentGroup[] = [];

  try {
    const documentsResponse = await serverApiService.get<ApiClaimDocument[]>(
      `/employer/documents/${claimantId}`,
    );
    documentGroups = mapApiDocuments(documentsResponse).documentGroups;
  } catch (error) {
    console.error("Failed to load documents:", error);
  }

  return <DocumentsPanel groups={documentGroups} />;
}
