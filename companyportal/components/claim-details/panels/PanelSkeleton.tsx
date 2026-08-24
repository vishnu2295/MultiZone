import Skeleton from "@/components/ui/Skeleton";

/** Generic row-of-cards loading placeholder for a claim-detail section. */
export default function PanelSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-5 w-40" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-[0px_2px_12px_rgba(0,0,0,0.06)]"
          >
            <Skeleton className="h-4 w-1/3" />
            <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
