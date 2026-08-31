import RequirementsPanel from "@/components/claim-details/panels/RequirementsPanel";

export default async function RequirementsPage({
  params,
}: {
  params: Promise<{ claimId: string }>;
}) {
  const { claimId } = await params;

<<<<<<< Updated upstream
  return <RequirementsPanel claimId={String(claimId)} />;
=======
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
    <DocumentUploadList
      title="Claim Requirements"
      documents={requirements}
      claimId={claimantId}
    />
  );
>>>>>>> Stashed changes
}
