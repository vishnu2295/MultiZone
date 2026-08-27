"use client";

import { useEffect, useState } from "react";
import {
  mapApiInvoice,
  type ApiInvoicesResponse,
  type CompanyInvoice,
} from "@/content/companyDetails";
import { InvoiceIcon, CheckCircleIcon, DownloadIcon } from "@/components/home/icons";
import Pagination from "@/components/ui/Pagination";
import Skeleton from "@/components/ui/Skeleton";
import apiService from "@/lib/api/apiService";
import { useCompanyProfile } from "@/lib/context/CompanyProfileContext";
import { downloadBase64File } from "@/lib/utils/downloadFile";
import { computePageCount } from "@/lib/utils/pagination";

function InvoiceRowSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-[0px_2px_12px_rgba(0,0,0,0.06)] sm:flex-row sm:items-center">
      <Skeleton className="h-11 w-11 shrink-0 rounded-lg" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-44" />
        <Skeleton className="h-3 w-36" />
      </div>
      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    </div>
  );
}

const statusStyles: Record<string, string> = {
  Paid: "bg-[#ECFDF5] text-[#14B86A]",
  Approved: "bg-[#EFF6FF] text-[#2563EB]",
  Pending: "bg-[#FFFBEB] text-[#F59E0B]",
  Overdue: "bg-[#FFF6F6] text-[#E90707]",
};

const PAGE_SIZE = 5;

export default function InvoicesPanel() {
  const { token, rolePlayerId } = useCompanyProfile();
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [invoices, setInvoices] = useState<CompanyInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!rolePlayerId) return;

    let cancelled = false;
    setIsLoading(true);

    async function loadInvoices() {
      try {
        const response = await apiService.get<ApiInvoicesResponse>(
          `/employer/${rolePlayerId}/invoices`,
          { token: token ?? undefined, params: { page, pageSize: PAGE_SIZE } },
        );

        if (!cancelled) {
          setInvoices(response.data.map(mapApiInvoice));
          setPageCount(computePageCount(response.rowCount, PAGE_SIZE));
        }
      } catch (error) {
        console.error("Failed to load invoices:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadInvoices();
    return () => {
      cancelled = true;
    };
  }, [page, rolePlayerId, token]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <InvoiceRowSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-6 text-center text-[13px] font-normal text-[#64748B] shadow-[0px_2px_16px_rgba(0,0,0,0.07)]">
        There are no invoices to display.
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
              disabled={!invoice.attachment}
              onClick={() =>
                invoice.attachment &&
                downloadBase64File(
                  invoice.attachment.fileName,
                  invoice.attachment.fileType,
                  invoice.attachment.content,
                )
              }
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-black/8 text-[#13537B] transition hover:bg-[#F3F7FA] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <DownloadIcon className="h-[15px] w-[15px]" />
            </button>
          </div>
        </div>
      ))}

      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
    </div>
  );
}
