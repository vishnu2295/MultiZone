import Link from "next/link";
import HomeNavbar from "@/components/home/HomeNavbar";
import PoliciesList from "@/components/policies/PoliciesList";
import { policiesContent } from "@/content/policies";
import { BackArrowIcon } from "@/components/home/icons";

export default function PoliciesPage() {
  return (
    <main className="min-h-screen bg-[#F3F7FA]">
      <HomeNavbar />

      <div className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-[112px] sm:px-6 lg:px-14">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-[14px] font-bold leading-[28px] text-[#13537B]"
        >
          <BackArrowIcon className="h-5 w-5" />
          Back
        </Link>

        <h1 className="mt-4 text-[18px] font-bold leading-6 text-[#13537B] sm:text-[20px] sm:leading-[24px]">
          {policiesContent.heading}
        </h1>

        <div className="mt-6">
          <PoliciesList />
        </div>
      </div>
    </main>
  );
}
