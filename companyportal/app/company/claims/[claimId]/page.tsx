import ClaimTabsPanel from "@/components/claim-details/ClaimTabsPanel";

export default async function ClaimDetailsIndexPage({
  params,
}: {
  params: Promise<{ claimId: string }>;
}) {
  const { claimId } = await params;

  return <ClaimTabsPanel claimId={String(claimId)} />;
}
