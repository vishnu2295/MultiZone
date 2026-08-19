import { ShieldIcon } from "@/components/home/icons";
import StatusPill from "@/components/claim-details/panels/StatusPill";
import type { ClaimAuthorization } from "@/content/claimDetails";

export default function AuthorizationsPanel({
  authorizations,
}: {
  authorizations: ClaimAuthorization[];
}) {
  return (
    <div className="flex flex-col gap-3">
      {authorizations.map((authorization) => (
        <div
          key={authorization.authorizationNumber}
          className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-[0px_2px_12px_rgba(0,0,0,0.06)] sm:flex-row sm:items-center"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EEFCFF]">
            <ShieldIcon className="h-4 w-4 text-[#00BBE6]" />
          </div>

          <div className="flex flex-1 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[14px] font-bold leading-[21px] text-[#13537B]">
                {authorization.authorizationNumber}
              </span>
              <StatusPill status={authorization.status} />
            </div>
            <p className="text-[11.5px] font-normal leading-[17px] text-[#64748B]">
              Treatment Type : {authorization.treatmentType}
            </p>
            <p className="text-[11.5px] font-normal leading-[17px] text-[#64748B]">
              Provider : {authorization.provider}
            </p>
          </div>

          <div className="flex flex-col gap-0.5 sm:items-end">
            <span className="text-[10px] font-semibold uppercase leading-[15px] tracking-[0.6px] text-[#64748B]">
              Valid Until
            </span>
            <span className="text-[13px] font-bold leading-5 text-[#13537B]">
              {authorization.validUntil}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
