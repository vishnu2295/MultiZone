import FieldGroupsPanel from "@/components/claim-details/panels/FieldGroupsPanel";

export default async function EmploymentPage({
  params,
}: {
  params: Promise<{ claimId: string }>;
}) {
  const { claimId } = await params;

  return <FieldGroupsPanel claimId={String(claimId)} />;
}
