import { homeContent } from "@/content/site";
import QuickActionCard from "@/components/home/QuickActionCard";

export default function QuickActions() {
  return (
    <section className="relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-16 sm:px-6 lg:px-14">
      <h2 className="text-[14px] font-normal leading-[17px] text-[#13537B]">
        {homeContent.quickActionsLabel}
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {homeContent.quickActions.map((action) => (
          <QuickActionCard key={action.title} {...action} />
        ))}
      </div>
    </section>
  );
}
