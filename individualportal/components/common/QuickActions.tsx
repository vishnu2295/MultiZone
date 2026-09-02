"use client";

import { homeContent } from "@/content/site";
import QuickActionCard from "@/components/common/QuickActionCard";
import { hasPensionerRecord, useProfile } from "@/lib/profile/ProfileContext";

export default function QuickActions() {
  const { profile } = useProfile();
  const isPensioner = hasPensionerRecord(profile);
  const visibleActions = homeContent.quickActions.filter(
    (action) => !action.requiresPensioner || isPensioner,
  );

  return (
    <section className="relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-16 sm:px-6 lg:px-[100px]">
      <h2 className="text-[14px] font-normal leading-[17px] text-[#24577A]">
        {homeContent.quickActionsLabel}
      </h2>

      {/* Figma: fixed 271px cards, 20px gutter - they must not stretch to fill. */}
      <div className="mt-6 flex flex-wrap gap-5">
        {visibleActions.map((action) => (
          <div key={action.title} className="w-full sm:w-[271px]">
            <QuickActionCard {...action} />
          </div>
        ))}
      </div>
    </section>
  );
}
