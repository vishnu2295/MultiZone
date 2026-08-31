import BeneficiariesPanel from "@/components/claim-details/panels/BeneficiariesPanel";

export default async function BeneficiariesPage({
  params,
}: {
  params: Promise<{ claimId: string }>;
}) {
  const { claimId } = await params;

  return <BeneficiariesPanel claimId={String(claimId)} />;
}
