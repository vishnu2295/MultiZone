const statusStyles: Record<string, string> = {
  Paid: "bg-[#ECFDF5] text-[#14B86A]",
  Approved: "bg-[#ECFDF5] text-[#14B86A]",
  Pending: "bg-[#FFF7E8] text-[#F59E0B]",
  Processing: "bg-[#FFF7E8] text-[#F59E0B]",
  Overdue: "bg-[#FFF6F6] text-[#E90707]",
};

export default function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold leading-[15px] ${
        statusStyles[status] ?? "bg-[#F3F7FA] text-[#13537B]"
      }`}
    >
      {status}
    </span>
  );
}
