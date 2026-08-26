import Image from "next/image";
import Link from "next/link";
import HomeNavbar from "@/components/home/HomeNavbar";
import ClaimInfoCard from "@/components/claim-details/ClaimInfoCard";
import { BackArrowIcon } from "@/components/home/icons";
import serverApiService from "@/lib/api/serverApiService";
import {
  getClaimantFullName,
  getClaimantInitials,
  type ApiClaimantDetailsResponse,
} from "@/content/claimDetails";

export default async function ClaimDetailsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ claimId: string }>;
}) {
  const { claimId } = await params;
  const claimantId = String(claimId);

  let claimantName = "";
  let initials = "";

  try {
    const claimantResponse =
      await serverApiService.get<ApiClaimantDetailsResponse>(
        `/employer/claimant/${claimantId}`,
      );
    claimantName = getClaimantFullName(claimantResponse.personalDetails);
    initials = getClaimantInitials(claimantResponse.personalDetails);
  } catch (error) {
    console.error("Failed to load claimant details:", error);
  }

  return (
    <main className="min-h-screen bg-[#F3F7FA]">
      <HomeNavbar />

      <div className="relative mx-auto w-full max-w-[1440px] px-4 pb-16 pt-[112px] sm:px-6 lg:px-14">
        <div className="pointer-events-none absolute right-0 top-[2px] h-[clamp(220px,29vw,414px)] w-[65%]">
          <Image
            src="/company/icons/pages_wave.png"
            alt=""
            fill
            quality={100}
            className="object-contain object-top"
          />
        </div>

        <Link
          href="/company/claims"
          className="relative z-10 inline-flex items-center gap-2 text-[14px] font-bold leading-[28px] text-[#13537B]"
        >
          <BackArrowIcon className="h-5 w-5" />
          Back
        </Link>

        <div className="relative z-10 mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
          <ClaimInfoCard
            claimId={claimantId}
            claimantName={claimantName}
            initials={initials}
            status=""
            claimRef=""
          />

          <div className="flex-1">{children}</div>
        </div>
      </div>
    </main>
  );
}
