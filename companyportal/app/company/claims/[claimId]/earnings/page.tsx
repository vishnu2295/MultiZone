import EarningsPanel from "@/components/claim-details/panels/EarningsPanel";
import serverApiService from "@/lib/api/serverApiService";
import {
  ApiClaimDocument,
  ClaimDocumentGroup,
  ClaimUploadDocument,
  mapEarningsDocuments,
  // getClaimDetails,
  mapApiEarnings,
  type ApiEarningsRecord,
  type ClaimEarningsRecord,
} from "@/content/claimDetails";

export default async function EarningsPage({
  params,
}: {
  params: Promise<{ claimId: string }>;
}) {
  const { claimId } = await params;

  return <EarningsPanel claimId={String(claimId)} />;
}
