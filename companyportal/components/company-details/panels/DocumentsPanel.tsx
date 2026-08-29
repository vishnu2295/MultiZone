"use client";

import { useEffect, useState } from "react";
import {
  companyDetailsContent,
  mapApiDocumentSets,
  type ApiDocumentSet,
  type ApiInvoiceAttachment,
  type ApiPagedResponse,
  type CompanyDocument,
} from "@/content/companyDetails";
import { DocumentIcon, DownloadIcon } from "@/components/home/icons";
import UploadDocumentModal from "@/components/company-details/UploadDocumentModal";
import Pagination from "@/components/ui/Pagination";
import Skeleton from "@/components/ui/Skeleton";
import apiService from "@/lib/api/apiService";
import { useCompanyProfile } from "@/lib/context/CompanyProfileContext";
import { downloadBase64File } from "@/lib/utils/downloadFile";
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
      <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
    </div>
  );
}

const PAGE_SIZE = 10;

export default function DocumentsPanel() {
  const { token, rolePlayerId } = useCompanyProfile();
  const [documents, setDocuments] = useState<CompanyDocument[]>([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!rolePlayerId) return;

    let cancelled = false;
    setIsLoading(true);

    async function loadDocuments() {
      try {
        const response = await apiService.get<ApiPagedResponse<ApiDocumentSet>>(
          `/employer/${rolePlayerId}/documents`,
          { token: token ?? undefined, params: { page, pageSize: PAGE_SIZE } },
        );

        if (!cancelled) {
          setDocuments(mapApiDocumentSets(response.data));
          setPageCount(computePageCount(response.rowCount, PAGE_SIZE));
        }
      } catch (error) {
        console.error("Failed to load documents:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadDocuments();
    return () => {
      cancelled = true;
    };
  }, [page, reloadToken, rolePlayerId, token]);

  async function handleDownload(documentId: string | undefined) {
    if (!documentId || !rolePlayerId) return;

    setDownloadingId(documentId);
    try {
      const response = await apiService.get<ApiInvoiceAttachment>(
        `/employer/${rolePlayerId}/documents/${documentId}/download`,
        { token: token ?? undefined },
      );

      downloadBase64File(response.fileName, response.fileType, response.content);
    } catch (error) {
      console.error("Failed to download document:", error);
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[16px] font-bold leading-[19px] text-[#24577A]">
          Documents
        </h2>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg cursor-pointer bg-[#51B2E0] px-5 py-2.5 text-[13px] font-bold text-white shadow-[0px_4px_16px_rgba(7,193,233,0.35)] transition hover:brightness-95"
        >
          Upload Documents
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-4">
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
            key={`${document.name}-${index}`}
            className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-[0px_2px_16px_rgba(218,218,218,0.08)]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EAF6FE]">
                <DocumentIcon className="h-5 w-5 text-[#07C1E9]" />
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-[15px] font-bold leading-[19px] text-[#24577A]">
                  {document.name}
                </span>
                <span className="flex items-center gap-2 text-[13px] leading-[18px] text-[#58585B]">
                  Document Type
                  <span className="text-[#58585B]">
                    : {document.documentType}
                  </span>
                  <span aria-hidden>&middot;</span>
                  {document.date}
                </span>
              </div>
            </div>

            <button
              type="button"
              aria-label="Download document"
              disabled={downloadingId === document.documentId}
              onClick={() => handleDownload(document.documentId)}
              className="flex h-10 w-10 cursor-pointer shrink-0 items-center justify-center rounded-lg border border-black/8 text-[#13537B] transition hover:bg-[#F3F7FA] disabled:cursor-not-allowed disabled:opacity-50"
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

      <UploadDocumentModal
        open={isModalOpen}
        documentTypes={companyDetailsContent.documentTypes}
        onClose={() => setIsModalOpen(false)}
        onSave={async (file, documentType) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("documentType", documentType);

          try {
            await apiService.post("/company/api/documents", formData, {
              baseUrl: "",
              skipAuth: true,
            });
          } catch (error) {
            console.error("Failed to upload document:", error);
            throw error;
          }

          setPage(1);
          setReloadToken((token) => token + 1);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
