import {
  medicalAuthorizationStatusColor,
  medicalAuthorizationsContent as content,
  type MedicalAuthorization,
} from "@/content/medicalAuthorizations";

/** One "label : value" pair from a card's meta line. */
function Meta({ label, value }: { label: string; value: string }) {
  return (
    <span className="whitespace-nowrap">
      {label} : <span className="font-semibold text-[#3C5564]">{value}</span>
    </span>
  );
}

export default function MedicalAuthorizationCard({
  auth,
}: {
  auth: MedicalAuthorization;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white px-5 py-5 shadow-[0px_2px_16px_0px_#00000012] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6">
      <div className="min-w-0">
        <h2 className="text-[15px] font-bold leading-snug text-[#13537B] sm:text-[16px]">
          {auth.title}
        </h2>

        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-[#6B7F8C]">
          <Meta label="Pre-auth No" value={auth.preAuthNo} />
          <span aria-hidden>&middot;</span>
          <Meta label="Claim Ref No" value={auth.claimRefNo} />
          <span aria-hidden>&middot;</span>
          <Meta label="Event Date" value={auth.eventDate} />
          <span aria-hidden>&middot;</span>
          <Meta label="Date Reported" value={auth.dateReported} />
        </div>
      </div>

      <div className="shrink-0 sm:text-right">
        <p className="text-[11px] text-[#6B7F8C]">{content.statusLabel}</p>
        <p
          className={`text-[14px] font-bold ${
            medicalAuthorizationStatusColor[auth.status] ?? "text-[#6B7F8C]"
          }`}
        >
          {auth.status}
        </p>
      </div>
    </div>
  );
}
