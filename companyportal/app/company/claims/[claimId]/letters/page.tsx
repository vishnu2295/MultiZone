import DocumentRow from "@/components/claim-details/panels/DocumentRow";
import { getClaimDetails } from "@/content/claimDetails";

export default async function LettersPage({
  params,
}: {
  params: Promise<{ claimId: string }>;
}) {
  const { claimId } = await params;
  const claim = getClaimDetails(String(claimId));

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
        Letters and Templates
      </h2>
      {claim.letters.map((letter) => (
        <DocumentRow key={letter.name} document={letter} />
      ))}
    </div>
  );
}
