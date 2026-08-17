import Link from "next/link";

import IndividualBackground from "@/components/common/IndividualBackground";
import { ArrowLeftIcon } from "@/components/common/icons";
import {
  medicalAuthorizations,
  medicalAuthorizationStatusColor,
  medicalAuthorizationsContent as content,
} from "@/content/medicalAuthorizations";

/** One "label : value" pair from a card's meta line. */
function Meta({ label, value }: { label: string; value: string }) {
  return (
    <span className="whitespace-nowrap">
      {label} : <span className="font-semibold text-[#3C5564]">{value}</span>
    </span>
  );
}

export default function MedicalAuthorizationsPage() {
  return (
    <IndividualBackground>
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-14 lg:py-10">
        <Link
          href={content.backHref}
          className="inline-flex items-center gap-2 text-[14px] font-bold text-[#13537B] transition hover:opacity-80"
        >
          <ArrowLeftIcon className="h-4 w-4" aria-hidden />
          {content.backLabel}
        </Link>

        <h1 className="mt-5 text-[20px] font-bold leading-tight text-[#13537B] sm:text-[22px]">
          {content.title}
        </h1>

        {medicalAuthorizations.length === 0 ? (
          <p className="mt-6 text-[13px] text-[#6B7F8C]">
            {content.emptyMessage}
          </p>
        ) : (
          <ul className="mt-6 flex flex-col gap-4">
            {medicalAuthorizations.map((auth) => (
              <li
                key={auth.id}
                className="flex flex-col gap-4 rounded-xl bg-white px-5 py-5 shadow-[2.8px_2.8px_28px_rgba(18,46,77,0.05)] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6"
              >
                <div className="min-w-0">
                  <h2 className="text-[15px] font-bold leading-snug text-[#13537B] sm:text-[16px]">
                    {auth.title}
                  </h2>

                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-[#6B7F8C]">
                    <Meta label="Pre-auth No" value={auth.preAuthNo} />
                    <span aria-hidden>·</span>
                    <Meta label="Claim Ref No" value={auth.claimRefNo} />
                    <span aria-hidden>·</span>
                    <Meta label="Event Date" value={auth.eventDate} />
                    <span aria-hidden>·</span>
                    <Meta label="Date Reported" value={auth.dateReported} />
                  </div>
                </div>

                <div className="shrink-0 sm:text-right">
                  <p className="text-[11px] text-[#6B7F8C]">
                    {content.statusLabel}
                  </p>
                  <p
                    className={`text-[14px] font-bold ${medicalAuthorizationStatusColor[auth.status]}`}
                  >
                    {auth.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </IndividualBackground>
  );
}
