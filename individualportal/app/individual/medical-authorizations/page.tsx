import Link from "next/link";

import IndividualBackground from "@/components/common/IndividualBackground";
import { ArrowLeftIcon } from "@/components/common/icons";
import MedicalAuthorizationsList from "@/components/medicalAuthorizations/MedicalAuthorizationsList";
import { medicalAuthorizationsContent as content } from "@/content/medicalAuthorizations";

export default function MedicalAuthorizationsPage() {
  return (
    <IndividualBackground>
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-[100px] lg:py-10">
        <Link
          href={content.backHref}
          className="inline-flex items-center gap-2 text-[14px] font-bold text-[#13537B] transition hover:opacity-80"
        >
          <ArrowLeftIcon className="h-4 w-4" aria-hidden />
          {content.backLabel}
        </Link>

        <h1 className="mt-5 text-[20px] font-bold leading-tight text-[#13537B] sm:text-[22px]">
          {content.title}
        </h1>

        <div className="mt-6">
          <MedicalAuthorizationsList />
        </div>
      </div>
    </IndividualBackground>
  );
}
