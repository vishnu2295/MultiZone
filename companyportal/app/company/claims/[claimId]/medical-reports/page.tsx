import MedicalReportsPanel from "@/components/claim-details/panels/MedicalReportsPanel";
import serverApiService from "@/lib/api/serverApiService";
import {
  mapApiDocuments,
  mapApiMedicalReports,
  type ApiClaimDocument,
  type ApiMedicalReportsResponse,
  type ClaimMedicalDocument,
  type ClaimMedicalReports,
} from "@/content/claimDetails";

export default async function MedicalReportsPage({
  params,
}: {
  params: Promise<{ claimId: string }>;
}) {
  const { claimId } = await params;
  const claimantId = String(claimId);

  let medicalReportDocuments: ClaimMedicalDocument[] = [];
  let medicalReports: ClaimMedicalReports = {} as ClaimMedicalReports;

  try {
    const [documentsResponse, medicalReportsResponse] = await Promise.all([
      serverApiService.get<ApiClaimDocument[]>(
        `/employer/documents/${claimantId}`,
      ),
      serverApiService.get<ApiMedicalReportsResponse>(
        `/employer/medicalRecords/${claimantId}`,
      ),
    ]);

    medicalReportDocuments =
      mapApiDocuments(documentsResponse).medicalReportDocuments;
    medicalReports = mapApiMedicalReports(medicalReportsResponse);
  } catch (error) {
    console.error("Failed to load medical reports:", error);
  }

  return (
    <MedicalReportsPanel
      reports={medicalReports}
      documents={medicalReportDocuments}
    />
  );
}
