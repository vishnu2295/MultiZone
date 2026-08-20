import type { ClaimFieldGroup } from "@/content/claimDetails";

export default function FieldGroupsPanel({ groups }: { groups: ClaimFieldGroup[] }) {
  return (
    <div className="flex flex-col gap-4">
      {groups.map((group) => (
        <div
          key={group.title}
          className="rounded-xl bg-white px-3 py-3.5 shadow-[0px_2px_16px_rgba(218,218,218,0.08)]"
        >
          <h3 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
            {group.title}
          </h3>

          <div className="mt-5 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {group.fields.map((field) => (
              <div key={field.label} className="flex min-w-0 flex-col">
                <span className="wrap-break-word text-[10px] font-semibold uppercase leading-[15px] tracking-[0.6px] text-[#64748B]">
                  {field.label}
                </span>
                <span className="wrap-break-word pt-0.5 text-[13px] font-bold leading-5 text-[#13537B]">
                  {field.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
