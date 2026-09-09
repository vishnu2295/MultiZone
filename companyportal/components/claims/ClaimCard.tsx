import type { Claim } from "@/content/claims";
import { useRouter } from "next/dist/client/components/navigation";
import EmployeeIcon from "@/components/icons/EmployeeIcon";

export default function ClaimCard({ claim }: { claim: Claim }) {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/company/claims/${claim.id}?ref=${claim.reference}`);
  };
  return (
    <article className="rounded-xl bg-white p-4 shadow-[0px_2px_16px_rgba(0,0,0,0.07)] sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div className="flex-1">
          <h2 className="text-[18px] font-extrabold leading-[27px] text-[#24577A]">
            {claim.title}
          </h2>
          <p className="mt-1 font-sans max-w-[760px] text-[12.5px] leading-[19px] text-[#24577A]">
            Claim Ref No :{claim.reference} · Event Date : {claim.eventDate} ·
            Date Reported :{claim.reportedDate}
          </p>
          <p className="mt-2 font-sans flex items-center gap-1.5 text-[12px] leading-[18px] text-[#24577A]">
            <EmployeeIcon aria-hidden />
            Employee : {claim.employee}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-6 lg:items-end lg:gap-3">
          <div className="flex flex-col items-start lg:items-end">
            <span className="text-[11px] font-medium leading-4 text-[#24577A]">
              Status
            </span>
            <span className="text-[16px] font-extrabold leading-6 text-[#ECB143]">
              {claim.status}
            </span>
          </div>
          <button
            type="button"
            onClick={handleClick}
            className="rounded-lg cursor-pointer bg-[#4FA8DB] px-5 py-2 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#3f92c2]"
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}
