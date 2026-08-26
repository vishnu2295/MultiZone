import FieldGroupsPanel from "@/components/claim-details/panels/FieldGroupsPanel";
import serverApiService from "@/lib/api/serverApiService";
import {
  mapApiEmploymentDetails,
  type ApiEmploymentDetails,
  type ClaimFieldGroup,
} from "@/content/claimDetails";

export default async function EmploymentPage({
  params,
}: {
  params: Promise<{ claimId: string }>;
}) {
  const { claimId } = await params;
  const claimantId = String(claimId);

  let employment: ClaimFieldGroup[] = [];

  try {
    const employmentResponse = await serverApiService.get<ApiEmploymentDetails>(
      `/employer/employment/${claimantId}`,
    );
    employment = mapApiEmploymentDetails(employmentResponse);
  } catch (error) {
    console.error("Failed to load employment details:", error);
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
        Employment Details
      </h2>
      <FieldGroupsPanel groups={employment} />
    </div>
  );
}
