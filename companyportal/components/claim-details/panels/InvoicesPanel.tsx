import { InvoiceIcon, DownloadIcon } from "@/components/home/icons";
import StatusPill from "@/components/claim-details/panels/StatusPill";
import type { ClaimMedicalInvoice } from "@/content/claimDetails";

export default function MedicalInvoicesPanel({
  invoices,
}: {
  invoices: ClaimMedicalInvoice[];
}) {
  if (invoices.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-6 text-center text-[13px] font-normal text-[#64748B] shadow-[0px_2px_12px_rgba(0,0,0,0.06)]">
        No documents found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {invoices.map((invoice, index) => (
        <div
          key={`${invoice.invoiceNumber}-${index}`}
          className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-[0px_2px_12px_rgba(0,0,0,0.06)] sm:flex-row sm:items-center"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EEFCFF]">
            <InvoiceIcon className="h-4 w-4 text-[#00BBE6]" />
          </div>

          <div className="flex flex-1 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[14px] font-bold leading-[21px] text-[#13537B]">
                {invoice.claimType}
              </span>
              <StatusPill status={invoice.invoiceStatus} />
            </div>
            <p className="text-[11.5px] font-normal leading-[17px] text-[#64748B]">
              practitionerNumber : {invoice.practitionerNumber}
            </p>
            <p className="text-[11.5px] font-normal leading-[17px] text-[#64748B]">
              invoice Date : {invoice.invoiceDate}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
            <span className="text-[18px] font-extrabold leading-[27px] text-[#13537B]">
              {invoice.invoiceAmount}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
