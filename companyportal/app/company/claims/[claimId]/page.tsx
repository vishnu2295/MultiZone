import ClaimTabsPanel from "@/components/claim-details/ClaimTabsPanel";
import serverApiService from "@/lib/api/serverApiService";
import {
  mapApiDocuments,
  type ApiClaimDocument,
  type ClaimMedicalDocument,
} from "@/content/claimDetails";

export default async function ClaimDetailsIndexPage({
  params,
}: {
  params: Promise<{ claimId: string }>;
}) {
  const { claimId } = await params;
  const claimantId = String(claimId);

  let invoiceDocuments: ClaimMedicalDocument[] = [];

  try {
    const documentsResponse = await serverApiService.get<ApiClaimDocument[]>(
      `/employer/documents/${claimantId}`,
    );
    invoiceDocuments = mapApiDocuments(documentsResponse).invoiceDocuments;
  } catch (error) {
    console.error("Failed to load claim documents:", error);
  }

  return (
    <ClaimTabsPanel
      invoiceDocuments={invoiceDocuments}
      medicalInvoices={[]}
      authorizations={[]}
      payments={[]}
    />
  );
}
