import ClaimantInjuryPanel from "@/components/claim-details/panels/ClaimantInjuryPanel";

export default async function ClaimantInjuryPage({
  params,
}: {
  params: Promise<{ claimId: string }>;
}) {
  const { claimId } = await params;

  return <ClaimantInjuryPanel claimId={String(claimId)} />;
}
