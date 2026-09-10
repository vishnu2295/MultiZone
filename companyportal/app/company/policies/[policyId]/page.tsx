import Image from "next/image";
import Link from "next/link";
import PolicyInfoCard from "@/components/policies/PolicyInfoCard";
import PolicyDetailsTabs from "@/components/policies/PolicyDetailsTabs";
import { BackArrowIcon } from "@/components/home/icons";

export default async function PolicyDetailsPage({
  params,
}: {
  params: Promise<{ policyId: string }>;
}) {
  const { policyId } = await params;

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
          href="/company/policies"
          className="relative inline-flex items-center gap-2 text-[14px] font-bold leading-[28px] text-[#13537B]"
        >
          <BackArrowIcon className="h-5 w-5" />
          Back
        </Link>

        <div className="relative mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
          <PolicyInfoCard policyId={String(policyId)} />
          <PolicyDetailsTabs policyId={String(policyId)} />
        </div>
      </div>
    </main>
  );
}
