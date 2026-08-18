import type { Claim } from "@/content/claims";

const statusColor: Record<string, string> = {
  Active: "text-[#3F9142]",
  Inactive: "text-[#6B7F8C]",
};

export default function ClaimCard({ claim }: { claim: Claim }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white px-6 py-5 shadow-[0px_2px_16px_0px_#00000012]">
      <div>
        <h2 className="text-[15px] font-bold text-[#13537B]">{claim.title}</h2>
        <p className="mt-1 text-[12px] text-[#6B7F8C]">
          Claim Ref No : <span className="font-semibold">{claim.refNo}</span> ·
          Event Date : <span className="font-semibold">{claim.eventDate}</span>{" "}
          · Date Reported :{" "}
          <span className="font-semibold">{claim.dateReported}</span>
        </p>
      </div>
      <div className="text-right">
        <p className="text-[11px] text-[#6B7F8C]">Status</p>
        <p
          className={`text-[13px] font-bold ${statusColor[claim.status] ?? "text-[#6B7F8C]"}`}
        >
          {claim.status}
        </p>
      </div>
    </div>
  );
}
