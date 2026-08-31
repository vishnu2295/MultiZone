import { InvoiceIcon, DownloadIcon } from "@/components/home/icons";
import StatusPill from "@/components/claim-details/panels/StatusPill";
import type { ClaimInvoice } from "@/content/claimDetails";

export default function InvoicesPanel({ invoices }: { invoices: ClaimInvoice[] }) {
  if (invoices.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-6 text-center text-[13px] font-normal text-[#64748B] shadow-[0px_2px_12px_rgba(0,0,0,0.06)]">
        No documents found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {invoices.map((invoice) => (
        <div
          key={invoice.invoiceNumber}
          className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-[0px_2px_12px_rgba(0,0,0,0.06)] sm:flex-row sm:items-center"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EEFCFF]">
            <InvoiceIcon className="h-4 w-4 text-[#00BBE6]" />
          </div>

          <div className="flex flex-1 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[14px] font-bold leading-[21px] text-[#13537B]">
                {invoice.invoiceNumber}
              </span>
              <StatusPill status={invoice.status} />
            </div>
            <p className="text-[11.5px] font-normal leading-[17px] text-[#64748B]">
              Provider : {invoice.provider}
            </p>
            <p className="text-[11.5px] font-normal leading-[17px] text-[#64748B]">
              Service Date : {invoice.serviceDate}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
            <span className="text-[18px] font-extrabold leading-[27px] text-[#13537B]">
              {invoice.amount}
            </span>
            <button
              type="button"
              aria-label={`Download invoice ${invoice.invoiceNumber}`}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-black/8 text-[#13537B] transition hover:bg-[#F3F7FA]"
            >
              <DownloadIcon className="h-[15px] w-[15px]" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
