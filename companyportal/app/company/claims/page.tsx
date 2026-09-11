import Link from "next/link";
import ClaimsList from "@/components/claims/ClaimsList";
import { claimsContent } from "@/content/claims";
import { BackArrowIcon } from "@/components/home/icons";

export default function MyClaimsPage() {
  return (
    <main className="min-h-screen bg-[#F3F7FA]">
      <div className="relative mx-auto w-full max-w-[1440px] px-4 pb-16 pt-[112px] sm:px-6 lg:px-14">
        <Link
          href="/company"
          className="relative inline-flex items-center gap-2 text-[14px] font-bold leading-[28px] text-[#13537B]"
        >
          <BackArrowIcon className="h-5 w-5" />
          Back
        </Link>

        <h1 className="relative mt-6 text-[20px] font-bold leading-6 text-[#13537B]">
          {claimsContent.heading}
        </h1>

        <div className="relative mt-5">
          <ClaimsList />
        </div>
      </div>
    </main>
  );
}
