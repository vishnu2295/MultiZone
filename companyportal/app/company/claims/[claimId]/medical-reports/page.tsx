import MedicalReportsPanel from "@/components/claim-details/panels/MedicalReportsPanel";

export default async function MedicalReportsPage({
  params,
}: {
  params: Promise<{ claimId: string }>;
}) {
  const { claimId } = await params;

  return <MedicalReportsPanel claimId={String(claimId)} />;
}
