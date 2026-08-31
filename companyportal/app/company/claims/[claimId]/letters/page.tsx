import LettersPanel from "@/components/claim-details/panels/LettersPanel";

export default async function LettersPage({
  params,
}: {
  params: Promise<{ claimId: string }>;
}) {
  const { claimId } = await params;

  return <LettersPanel claimId={String(claimId)} />;
}
