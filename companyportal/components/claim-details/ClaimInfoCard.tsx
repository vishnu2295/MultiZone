"use client";

import { claimSections, type ClaimDetails, type ClaimSection } from "@/content/claimDetails";

type ClaimInfoCardProps = {
  claim: ClaimDetails;
  activeSection: ClaimSection | null;
  onSelectSection: (section: ClaimSection | null) => void;
};

export default function ClaimInfoCard({
  claim,
  activeSection,
  onSelectSection,
}: ClaimInfoCardProps) {
  return (
    <aside className="w-full shrink-0 rounded-xl bg-white p-4 shadow-[0px_4px_29.5px_rgba(0,0,0,0.05)] lg:w-[327px]">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex h-11 w-[47px] items-center justify-center rounded-lg bg-[#F5B121]">
            <span className="text-[14px] font-bold leading-[17px] text-white">
              {claim.initials}
            </span>
          </div>
          <span className="rounded-full bg-[#CAE9A4] px-3 py-1 text-[12px] font-bold italic leading-[15px] text-black">
            {claim.status}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[16px] font-bold leading-[19px] text-[#13537B]">
            {claim.claimantName}
          </p>
          <p className="text-[14px] font-normal leading-[17px] text-[#3C5564]">
            Claim Ref No : {claim.claimRef}
          </p>
        </div>
      </div>

      <span className="mt-5 block h-px w-full bg-black/5" aria-hidden />

      <nav className="mt-4 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => onSelectSection(null)}
          className={`flex items-center gap-1 text-left text-[12px] leading-[15px] text-[#13537B] transition cursor-pointer ${
            activeSection === null
              ? "rounded-lg bg-[#F3F7FA] px-2 py-2.5 font-bold"
              : "px-2 py-0.5 font-normal hover:bg-[#F3F7FA] hover:rounded-lg"
          }`}
        >
          Claims
        </button>

        {claimSections.map((section) => (
          <button
            key={section}
            type="button"
            onClick={() => onSelectSection(section)}
            className={`flex items-center gap-1 text-left text-[12px] leading-[15px] text-[#13537B] transition cursor-pointer ${
              activeSection === section
                ? "rounded-lg bg-[#F3F7FA] px-2 py-2.5 font-bold"
                : "px-2 py-0.5 font-normal hover:bg-[#F3F7FA] hover:rounded-lg"
            }`}
          >
            {section}
          </button>
        ))}
      </nav>

      <span className="mt-4 block h-px w-full bg-black/5" aria-hidden />
    </aside>
  );
}
