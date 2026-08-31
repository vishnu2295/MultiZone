import RequirementsPanel from "@/components/claim-details/panels/RequirementsPanel";

export default async function RequirementsPage({
  params,
}: {
  params: Promise<{ claimId: string }>;
}) {
  const { claimId } = await params;

  return <RequirementsPanel claimId={String(claimId)} />;
}
