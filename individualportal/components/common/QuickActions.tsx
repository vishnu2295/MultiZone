import { homeContent } from "@/content/site";
import QuickActionCard from "@/components/common/QuickActionCard";

export default function QuickActions() {
  return (
    <section className="relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-16 sm:px-6 lg:px-[100px]">
      <h2 className="text-[14px] font-normal leading-[17px] text-[#13537B]">
        {homeContent.quickActionsLabel}
      </h2>

      {/* Figma: fixed 271px cards, 20px gutter — they must not stretch to fill. */}
      <div className="mt-6 flex flex-wrap gap-5">
        {homeContent.quickActions.map((action) => (
          <div key={action.title} className="w-full sm:w-[271px]">
            <QuickActionCard {...action} />
          </div>
        ))}
      </div>
    </section>
  );
}
