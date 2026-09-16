import EarningsPanel from "@/components/claim-details/panels/EarningsPanel";

export default async function EarningsPage({
  params,
}: {
  params: Promise<{ claimId: string }>;
}) {
  const { claimId } = await params;

  return <EarningsPanel claimId={String(claimId)} />;
}
