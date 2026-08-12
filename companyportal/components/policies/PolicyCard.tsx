import { CheckCircleIcon, DownloadIcon } from "@/components/home/icons";
import type { Policy } from "@/content/policies";

const infoColumns = (
  policy: Policy
): Array<{ label: string; value: string }> => [
  { label: "Product Option", value: policy.productOption },
  { label: "Annual Premium", value: policy.annualPremium },
  { label: "Premium", value: policy.premium },
  { label: "Inception Date", value: policy.inceptionDate },
  { label: "Expiry Date", value: policy.expiryDate },
];

export default function PolicyCard({ policy }: { policy: Policy }) {
  return (
    <article className="w-full rounded-2xl bg-white p-4 shadow-[0px_2px_16px_rgba(0,0,0,0.07)] sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-[16px] font-extrabold leading-[24px] text-[#13537B] sm:text-[18px] sm:leading-[27px]">
          {policy.title}
        </h3>
        {policy.compliant && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[11px] font-bold leading-4 text-[#14B86A]">
            <CheckCircleIcon className="h-2.5 w-2.5" />
            Compliant
          </span>
        )}
      </div>

      <p className="mt-1 text-[12.5px] font-normal leading-[19px] text-[#64748B]">
        Policy Number &middot; {policy.policyNumber}
      </p>

      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
        {infoColumns(policy).map((column) => (
          <div key={column.label} className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold uppercase leading-[15px] tracking-[0.6px] text-[#64748B]">
              {column.label}
            </span>
            <span className="text-[13px] font-bold leading-5 text-[#13537B]">
              {column.value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-black/5 pt-5">
        {policy.actions.map((action) => (
          <button
            key={action}
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-black/8 px-4 py-2 text-[12px] font-semibold leading-[18px] text-[#13537B] transition hover:bg-[#F3F7FA]"
          >
            <DownloadIcon className="h-[13px] w-[13px]" />
            {action}
          </button>
        ))}
      </div>
    </article>
  );
}
