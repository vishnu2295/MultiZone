import type { ClaimIcdCode } from "@/content/claimDetails";

function IcdMetaItem({
  label,
  value,
  withDivider,
}: {
  label: string;
  value: string;
  withDivider: boolean;
}) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex items-center gap-1.5">
        <span className="text-[12px] font-normal leading-[18px] text-[#64748B]">
          {label}
        </span>
        <span className="text-[12px] font-bold leading-[18px] text-[#13537B]">
          : {value}
        </span>
      </span>
      {withDivider && <span className="h-3.5 w-px bg-[#D8E1E8]" aria-hidden />}
    </span>
  );
}

export default function IcdCodeCard({ icdCode }: { icdCode: ClaimIcdCode }) {
  const meta = [
    { label: "Expiry Date", value: icdCode.expiryDate },
    { label: "Severity", value: icdCode.severity },
    { label: "MMI Days", value: icdCode.mmiDays },
    { label: "Body Side", value: icdCode.bodySide },
  ];

  return (
    <article className="rounded-xl bg-white px-4 py-4 shadow-[0px_2px_16px_rgba(218,218,218,0.08)]">
      <h3 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
        {icdCode.description} ({icdCode.code})
      </h3>

      <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1">
        {meta.map((item, index) => (
          <IcdMetaItem
            key={item.label}
            label={item.label}
            value={item.value}
            withDivider={index < meta.length - 1}
          />
        ))}
      </div>
    </article>
  );
}
