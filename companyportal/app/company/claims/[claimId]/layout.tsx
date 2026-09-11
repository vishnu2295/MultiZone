import Link from "next/link";
import ClaimInfoCard from "@/components/claim-details/ClaimInfoCard";
import { BackArrowIcon } from "@/components/home/icons";

export default async function ClaimDetailsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ claimId: string }>;
}) {
  const { claimId } = await params;
  const claimantId = String(claimId);
  return (
    <main className="min-h-screen bg-[#F3F7FA]">
      <div className="relative mx-auto w-full max-w-[1440px] px-4 pb-16 pt-[112px] sm:px-6 lg:px-14">
        <Link
          href="/company/claims"
          className="relative inline-flex items-center gap-2 text-[14px] font-bold leading-[28px] text-[#13537B]"
        >
          <BackArrowIcon className="h-5 w-5" />
          Back
        </Link>

        <div className="relative mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
          <ClaimInfoCard claimId={claimantId} />

          <div className="flex-1">{children}</div>
        </div>
      </div>
    </main>
  );
}
