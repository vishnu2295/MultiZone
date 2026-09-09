import { CheckCircleIcon } from "@/components/home/icons";
import { getDummyPolicyDetail } from "@/content/policyDetails";

export default function PolicyInfoCard({ policyId }: { policyId: string }) {
  const policy = getDummyPolicyDetail(policyId);

  const infoRows = [
    { label: "Product Option", value: policy.productOption },
    { label: "Inception Date", value: policy.inceptionDate },
    { label: "Expiry Date", value: policy.expiryDate },
    { label: "Insurer", value: policy.insurer },
    { label: "Payment Frequency", value: policy.paymentFrequency },
  ];

  return (
    <aside className="w-full shrink-0 rounded-xl bg-white p-4 shadow-[0px_4px_29.5px_rgba(0,0,0,0.05)] lg:w-[327px] lg:sticky lg:top-24 lg:self-start">
      <h2 className="text-[16px] font-bold leading-[19px] text-[#24577A]">
        Policy Details
      </h2>

      <div className="relative mt-4 overflow-hidden rounded-lg p-4 bg-[var(--blues-gradient-100,#006DA6)] shadow-[0px_4px_28.9px_0px_#00000040]">
        <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full bg-white/10" />

        <div className="relative flex items-center justify-between">
          <span className="inline-flex items-center rounded-md bg-[#F5B121] px-2.5 py-1.5 text-[11px] font-bold leading-[15px] text-white">
            {policy.code}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#CAE9A4] px-3 py-1 text-[11px] font-bold leading-[15px] text-black">
            <CheckCircleIcon className="h-2.5 w-2.5" />
            {policy.status}
          </span>
        </div>

        <div className="relative mt-4 flex flex-col gap-1">
          <p className="text-[15px] font-bold leading-[19px] text-white">
            {policy.title}
          </p>
          <p className="text-[13px] font-normal leading-[17px] text-white">
            Policy No : {policy.policyNumber}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {infoRows.map((row, index) => (
          <div key={row.label} className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <span className="shrink-0 text-[12px] font-normal leading-[15px] text-[#24577ACC]">
                {row.label}
              </span>
              <span className="min-w-0 flex-1 break-words text-right text-[12px] font-semibold leading-[15px] text-[#24577A]">
                {row.value}
              </span>
            </div>
            {index < infoRows.length - 1 && (
              <span className="h-px w-full bg-black/5" aria-hidden />
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
