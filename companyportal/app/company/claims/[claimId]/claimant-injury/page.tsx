import ClaimantInjuryPanel from "@/components/claim-details/panels/ClaimantInjuryPanel";
import serverApiService from "@/lib/api/serverApiService";
import {
  mapApiClaimantDetails,
  mapApiIcdCodes,
  mapApiInjuryDetails,
  type ApiClaimantDetailsResponse,
  type ApiIcdCode,
  type ApiInjuryDetailsResponse,
  type ClaimantDetails,
  type ClaimIcdCode,
} from "@/content/claimDetails";

export default async function ClaimantInjuryPage({
  params,
}: {
  params: Promise<{ claimId: string }>;
}) {
  const { claimId } = await params;
  const claimantId = String(claimId);

  let details: ClaimantDetails = {} as ClaimantDetails;
  let injuryDetails: any = {};
  let icdCodes: ClaimIcdCode[] = [];

  try {
    const [claimantResponse, injuryResponse, icdCodesResponse] =
      await Promise.all([
        serverApiService.get<ApiClaimantDetailsResponse>(
          `/employer/claimant/${claimantId}`,
        ),
        serverApiService.get<ApiInjuryDetailsResponse>(
          `/employer/injury/${claimantId}`,
        ),
        serverApiService.get<ApiIcdCode[]>(
          `/employer/icd10codes/${claimantId}`,
        ),
      ]);

    details = mapApiClaimantDetails(claimantResponse);
    injuryDetails = mapApiInjuryDetails(injuryResponse);
    icdCodes = mapApiIcdCodes(icdCodesResponse);
  } catch (error) {
    console.error("Failed to load claimant/injury details:", error);
  }

  return (
    <ClaimantInjuryPanel
      details={details}
      injuryDetails={injuryDetails}
      icdCodes={icdCodes}
    />
  );
}
