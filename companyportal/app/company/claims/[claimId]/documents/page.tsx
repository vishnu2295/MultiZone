import DocumentsPanel from "@/components/claim-details/panels/DocumentsPanel";

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ claimId: string }>;
}) {
  const { claimId } = await params;

  return <DocumentsPanel claimId={String(claimId)} />;
}
