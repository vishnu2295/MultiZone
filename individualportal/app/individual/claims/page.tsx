import Link from "next/link";

import IndividualBackground from "@/components/common/IndividualBackground";

const claims = [
  {
    title: "Workplace Accident Claim",
    refNo: "CLM-2024-003",
    eventDate: "Mar 10, 2024",
    dateReported: "Jul 10, 2026",
    status: "Pending" as const,
  },
  {
    title: "Workplace Accident Claim",
    refNo: "CLM-2024-003",
    eventDate: "Mar 10, 2024",
    dateReported: "Jul 10, 2026",
    status: "Completed" as const,
  },
];

const statusColor = {
  Pending: "text-[#E0A527]",
  Completed: "text-[#3F9142]",
};

export default function MyClaimsPage() {
  return (
    <IndividualBackground>
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-[100px] py-10">
        <Link
          href="/individual"
          className="inline-flex items-center gap-2 text-[14px] text-[#13537B]"
        >
          <span aria-hidden>←</span> Back
        </Link>

        <h1 className="mt-4 text-[22px] font-bold text-[#13537B]">My Claims</h1>

        <div className="mt-6 flex flex-col gap-4">
          {claims.map((claim, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl bg-white px-6 py-5 shadow-[2.8px_2.8px_28px_rgba(18,46,77,0.05)]"
            >
              <div>
                <h2 className="text-[15px] font-bold text-[#13537B]">{claim.title}</h2>
                <p className="mt-1 text-[12px] text-[#6B7F8C]">
                  Claim Ref No : <span className="font-semibold">{claim.refNo}</span> · Event
                  Date : <span className="font-semibold">{claim.eventDate}</span> · Date
                  Reported : <span className="font-semibold">{claim.dateReported}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-[#6B7F8C]">Status</p>
                <p className={`text-[13px] font-bold ${statusColor[claim.status]}`}>
                  {claim.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </IndividualBackground>
  );
}
