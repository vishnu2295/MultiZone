"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  mapApiEmployerDocuments,
  type ApiDocumentSet,
  type ApiEmployerDocument,
  type ApiPagedResponse,
  type CompanyDocument,
} from "@/content/companyDetails";
import type { ApiSaveDocumentRequest, ApiSavedDocument } from "@/content/claimDetails";
import { DocumentIcon, DownloadIcon } from "@/components/home/icons";
import UploadDocumentModal from "@/components/company-details/UploadDocumentModal";
import Pagination from "@/components/ui/Pagination";
import Skeleton from "@/components/ui/Skeleton";
import apiService from "@/lib/api/apiService";
import { useCompanyProfile } from "@/lib/context/CompanyProfileContext";
import {
  DocumentSetEnum,
  DocumentStatusEnum,
  DocumentSystemNameEnum,
  documentSetOptions,
} from "@/lib/constants";
import { downloadFileFromUrl } from "@/lib/utils/downloadFile";
import { fileToBase64 } from "@/lib/utils/file";
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
            keyName: "RolePlayerId",
            keyValue: rolePlayerId,
            page,
            pageSize: PAGE_SIZE,
          },
        });

        if (!cancelled) {
          setDocuments(mapApiEmployerDocuments(response.data));
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

  async function handleDownload(document: CompanyDocument) {
    const response = await apiService.get<ApiPagedResponse<ApiEmployerDocument>>(
      "/employer/documents",
      {
        token: token ?? undefined,
        params: {
          keyName: "DocumentId",
          keyValue: document.documentId,
          page: 1,
          pageSize: 10,
        },
      },
    );

    const downloaded = response.data[0];
    if (!downloaded?.documentUri) return;
    downloadFileFromUrl(downloaded.documentUri, downloaded.fileName);
  }

  const fetchDocumentTypes = useCallback(
    (documentSet: DocumentSetEnum) =>
      apiService.get<ApiDocumentSet[]>(`/employer/documentTypes/${documentSet}`, {
        token: token ?? undefined,
      }),
    [token],
  );

  const groupedDocuments = useMemo(() => {
    const groups = new Map<number, CompanyDocument[]>();
    for (const document of documents) {
      const group = groups.get(document.documentSet);
      if (group) group.push(document);
      else groups.set(document.documentSet, [document]);
    }

    return Array.from(groups.entries()).map(([documentSet, docs]) => ({
      documentSet,
      label:
        documentSetOptions.find((option) => option.value === documentSet)?.label ??
        String(documentSet),
      documents: docs,
    }));
  }, [documents]);

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

      <div className="mt-6 flex flex-col gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <DocumentRowSkeleton key={index} />
          ))
        ) : documents.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-center text-[13px] font-normal text-[#64748B] shadow-[0px_2px_16px_rgba(218,218,218,0.08)]">
            There are no documents to display.
          </div>
        ) : (
          groupedDocuments.map((group) => (
            <div key={group.documentSet} className="flex flex-col gap-4">
              <h3 className="text-[13px] font-bold text-[#24577A]">{group.label}</h3>
              {group.documents.map((document, index) => (
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
                    disabled={!document.documentUri}
                    onClick={() => handleDownload(document)}
                    className="flex h-10 w-10 cursor-pointer shrink-0 items-center justify-center rounded-lg border border-black/8 text-[#13537B] transition hover:bg-[#F3F7FA] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <DownloadIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {!isLoading && documents.length > 0 && (
        <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
      )}

      <UploadDocumentModal
        open={isModalOpen}
        documentSetOptions={documentSetOptions}
        fetchDocumentTypes={fetchDocumentTypes}
        onClose={() => setIsModalOpen(false)}
        onSave={async (file, documentSet, documentType) => {
          const fileAsBase64 = await fileToBase64(file);
          const payload: ApiSaveDocumentRequest = {
            docTypeId: documentType.id,
            fileExtension: file.name.split(".").pop() ?? "",
            fileName: file.name,
            keys: { RolePlayerId: String(rolePlayerId) },
            documentStatus: DocumentStatusEnum.Received,
            documentSet: DocumentSetEnum[documentSet],
            isMemberVisible: true,
            documentDescription: "",
            systemName:
              DocumentSystemNameEnum[DocumentSystemNameEnum.RolePlayerDocuments],
            fileAsBase64,
          };

          await apiService.post<ApiSavedDocument>(
            `/employer/${rolePlayerId}/saveDocuments`,
            payload,
            { token: token ?? undefined },
          );

          setPage(1);
          setReloadToken((token) => token + 1);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
