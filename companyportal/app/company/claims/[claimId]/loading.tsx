import Skeleton from "@/components/ui/Skeleton";
import PanelSkeleton from "@/components/claim-details/panels/PanelSkeleton";

export default function ClaimTabsLoading() {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-[30px] w-24 rounded-md" />
        <Skeleton className="h-[30px] w-32 rounded-md" />
        <Skeleton className="h-[30px] w-28 rounded-md" />
        <Skeleton className="h-[30px] w-24 rounded-md" />
      </div>

      <div className="mt-6">
        <PanelSkeleton rows={4} />
      </div>
    </>
  );
}
