import { companyDetailsContent } from "@/content/companyDetails";
import { InvoiceIcon, CheckCircleIcon, DownloadIcon } from "@/components/home/icons";

const statusStyles: Record<string, string> = {
  Paid: "bg-[#ECFDF5] text-[#14B86A]",
  Overdue: "bg-[#FFF6F6] text-[#E90707]",
};

export default function InvoicesPanel() {
  return (
    <div className="flex flex-col gap-3">
      {companyDetailsContent.invoices.map((invoice, index) => (
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
                {invoice.invoiceNumber}
              </span>
              <span
                className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold leading-[15px] ${
                  statusStyles[invoice.status] ?? "bg-[#F3F7FA] text-[#13537B]"
                }`}
              >
                <CheckCircleIcon className="h-[9px] w-[9px]" />
                {invoice.status}
              </span>
            </div>
            <p className="text-[11.5px] font-normal leading-[17px] text-[#64748B]">
              Invoice Number : {invoice.invoiceNumberFull}
            </p>
            <p className="text-[11.5px] font-normal leading-[17px] text-[#64748B]">
              Collection Cycle : {invoice.collectionCycle}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
            <span className="text-[18px] font-extrabold leading-[27px] text-[#13537B]">
              {invoice.amount}
            </span>
            <button
              type="button"
              aria-label="Download invoice"
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
