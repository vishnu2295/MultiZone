import DocumentRow from "@/components/claim-details/panels/DocumentRow";
import serverApiService from "@/lib/api/serverApiService";
import {
  mapApiLetters,
  type ApiClaimDocument,
  type ClaimMedicalDocument,
} from "@/content/claimDetails";

export default async function LettersPage({
  params,
}: {
  params: Promise<{ claimId: string }>;
}) {
  const { claimId } = await params;
  const claimantId = String(claimId);

  let letters: ClaimMedicalDocument[] = [];

  try {
    const lettersResponse = await serverApiService.get<ApiClaimDocument[]>(
      `/employer/lettersAndTemplates/${claimantId}`,
    );
    letters = mapApiLetters(lettersResponse);
  } catch (error) {
    console.error("Failed to load letters:", error);
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
        Letters and Templates
      </h2>
      {letters.map((letter) => (
        <DocumentRow key={letter.name} document={letter} />
      ))}
    </div>
  );
}
