import BeneficiariesPanel from "@/components/claim-details/panels/BeneficiariesPanel";
import serverApiService from "@/lib/api/serverApiService";
import {
  mapApiBeneficiaries,
  type ApiBeneficiary,
  type ClaimBeneficiary,
} from "@/content/claimDetails";

export default async function BeneficiariesPage({
  params,
}: {
  params: Promise<{ claimId: string }>;
}) {
  const { claimId } = await params;
  const claimantId = String(claimId);

  let beneficiaries: ClaimBeneficiary[] = [];

  try {
    const beneficiariesResponse = await serverApiService.get<ApiBeneficiary[]>(
      `/employer/beneficiaries/${claimantId}`,
    );
    beneficiaries = mapApiBeneficiaries(beneficiariesResponse);
  } catch (error) {
    console.error("Failed to load beneficiaries:", error);
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
        Beneficiaries
      </h2>
      <BeneficiariesPanel beneficiaries={beneficiaries} />
    </div>
  );
}
