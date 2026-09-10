"use client";

import { useEffect, useState } from "react";
import {
  mapApiEmployerDocuments,
  type ApiEmployerDocument,
  type ApiPagedResponse,
  type CompanyDocument,
} from "@/content/companyDetails";
import { DocumentIcon, DownloadIcon } from "@/components/home/icons";
import Pagination from "@/components/ui/Pagination";
import Skeleton from "@/components/ui/Skeleton";
import apiService from "@/lib/api/apiService";
import { useCompanyProfile } from "@/lib/context/CompanyProfileContext";
import { downloadFileFromUrl } from "@/lib/utils/downloadFile";
import { computePageCount } from "@/lib/utils/pagination";

function DocumentRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-[0px_2px_16px_rgba(218,218,218,0.08)]">
      <div className="flex items-center gap-3">
        <Skeleton className="h-11 w-11 shrink-0 rounded-lg" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-44" />
        </div>
      </div>
      <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
    </div>
  );
}

const PAGE_SIZE = 10;

export default function PolicyDocumentsPanel({ policyId }: { policyId: string }) {
  const { token, rolePlayerId } = useCompanyProfile();
  const [documents, setDocuments] = useState<CompanyDocument[]>([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!rolePlayerId) return;

    let cancelled = false;
    setIsLoading(true);

    async function loadDocuments() {
      try {
        const response = await apiService.get<
          ApiPagedResponse<ApiEmployerDocument>
        >(`/employer/documents`, {
          token: token ?? undefined,
          params: {
            keyName: "policyId",
            keyValue: policyId,
            page,
            pageSize: PAGE_SIZE,
          },
        });

        if (!cancelled) {
          setDocuments(mapApiEmployerDocuments(response.data));
          setPageCount(computePageCount(response.rowCount, PAGE_SIZE));
        }
      } catch (error) {
        console.error("Failed to load policy documents:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadDocuments();
    return () => {
      cancelled = true;
    };
  }, [page, policyId, rolePlayerId, token]);

  function handleDownload(document: CompanyDocument) {
    if (!document.documentUri) return;
    downloadFileFromUrl(document.documentUri, document.name);
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <DocumentRowSkeleton key={index} />
          ))
        ) : documents.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-center text-[13px] font-normal text-[#64748B] shadow-[0px_2px_16px_rgba(218,218,218,0.08)]">
            There are no documents to display.
          </div>
        ) : (
          documents.map((document, index) => (
            <div
              key={`${document.documentId}-${index}`}
              className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-[0px_2px_16px_rgba(218,218,218,0.08)]"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EAF6FE]">
                  <DocumentIcon className="h-5 w-5 text-[#07C1E9]" />
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-bold leading-[21px] text-[#13537B]">
                    {document.name}
                  </span>
                  <span className="text-[11.5px] leading-[17px] text-[#64748B]">
                    {document.documentType} &middot; {document.date}
                  </span>
                </div>
              </div>

              <button
                type="button"
                aria-label={`Download ${document.name}`}
                disabled={!document.documentUri}
                onClick={() => handleDownload(document)}
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-black/8 text-[#13537B] transition hover:bg-[#F3F7FA] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <DownloadIcon className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {!isLoading && documents.length > 0 && (
        <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
      )}
    </div>
  );
}
