import Image from "next/image";
import Link from "next/link";
import ClaimsList from "@/components/claims/ClaimsList";
import { claimsContent } from "@/content/claims";
import { BackArrowIcon } from "@/components/home/icons";

export default function MyClaimsPage() {
  return (
    <main className="min-h-screen bg-[#F3F7FA]">
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
          href="/company"
          className="relative z-10 inline-flex items-center gap-2 text-[14px] font-bold leading-[28px] text-[#13537B]"
        >
          <BackArrowIcon className="h-5 w-5" />
          Back
        </Link>

        <h1 className="relative z-10 mt-6 text-[20px] font-bold leading-6 text-[#13537B]">
          {claimsContent.heading}
        </h1>

        <div className="relative z-10 mt-5">
          <ClaimsList />
        </div>
      </div>
    </main>
  );
}
