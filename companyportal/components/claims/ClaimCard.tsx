import type { Claim } from "@/content/claims";
import { useRouter } from "next/dist/client/components/navigation";

export default function ClaimCard({ claim }: { claim: Claim }) {
  const router = useRouter();
  const handleClick = () => {
    // Navigate to the claim details page
    router.push(`/company/claims/${claim.id}`);
  };
  return (
    <article className="cursor-pointer rounded-xl bg-white p-4 shadow-[0px_2px_16px_rgba(0,0,0,0.07)] sm:p-6">
      <div
        className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6"
        onClick={handleClick}
      >
        <div className="flex-1">
          <h2 className="text-[18px] font-extrabold leading-[27px] text-[#13537B]">
            {claim.title}
          </h2>
          <p className="mt-1 max-w-[760px] text-[12.5px] leading-[19px] text-[#64748B]">
            Claim Ref No : {claim.reference} · Event Date : {claim.eventDate} ·
            Date Reported : {claim.reportedDate}
          </p>
          <p className="mt-2 text-[12px] leading-[18px] text-[#64748B]">
            <span aria-hidden className="mr-1">
              ◦
            </span>
            Employee : {claim.employee}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-start lg:items-end">
          <span className="text-[11px] font-medium leading-4 text-[#64748B]">
            Status
          </span>
          <span className="text-[16px] font-extrabold leading-6 text-[#F59E0B]">
            {claim.status}
          </span>
        </div>
      </div>
    </article>
  );
}
