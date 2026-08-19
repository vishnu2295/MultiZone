import { BankIcon } from "@/components/home/icons";
import StatusPill from "@/components/claim-details/panels/StatusPill";
import type { ClaimPayment } from "@/content/claimDetails";

export default function PaymentsPanel({ payments }: { payments: ClaimPayment[] }) {
  return (
    <div className="flex flex-col gap-3">
      {payments.map((payment) => (
        <div
          key={payment.paymentNumber}
          className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-[0px_2px_12px_rgba(0,0,0,0.06)] sm:flex-row sm:items-center"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EEFCFF]">
            <BankIcon className="h-4 w-4 text-[#00BBE6]" />
          </div>

          <div className="flex flex-1 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[14px] font-bold leading-[21px] text-[#13537B]">
                {payment.paymentNumber}
              </span>
              <StatusPill status={payment.status} />
            </div>
            <p className="text-[11.5px] font-normal leading-[17px] text-[#64748B]">
              Paid To : {payment.paidTo}
            </p>
            <p className="text-[11.5px] font-normal leading-[17px] text-[#64748B]">
              Payment Date : {payment.paymentDate} · Method : {payment.method}
            </p>
          </div>

          <span className="text-[18px] font-extrabold leading-[27px] text-[#13537B] sm:text-right">
            {payment.amount}
          </span>
        </div>
      ))}
    </div>
  );
}
