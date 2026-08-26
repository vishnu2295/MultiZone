"use client";

import { useState } from "react";
import { DocumentIcon, DownloadIcon } from "@/components/home/icons";
import type { ClaimMedicalDocument } from "@/content/claimDetails";
import apiService from "@/lib/api/apiService";
import { getEmployerCoidId } from "@/lib/auth/employerClaims";
import { downloadBase64File } from "@/lib/utils/downloadFile";

interface ApiDocumentDownload {
  fileName: string;
  fileType: string;
  content: string;
}

export default function DocumentRow({
  document,
}: {
  document: ClaimMedicalDocument;
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  async function handleDownload() {
    if (!document.documentId) return;

    setIsDownloading(true);
    try {
      const { token, coidId } = await getEmployerCoidId();
      if (!coidId) return;

      const response = await apiService.get<ApiDocumentDownload>(
        `/employer/${coidId}/documents/${document.documentId}/download`,
        { token },
      );

      downloadBase64File(
        response.fileName,
        response.fileType,
        response.content,
      );
    } catch (error) {
      console.error("Failed to download document:", error);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-[0px_2px_16px_rgba(218,218,218,0.08)]">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EAF6FE]">
          <DocumentIcon className="h-5 w-5 text-[#07C1E9]" />
        </span>

        <div className="flex flex-col gap-0.5">
          <span className="text-[14px] font-bold leading-[21px] text-[#13537B]">
            {document.name}
          </span>

          {document.documentType && (
            <span className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11.5px] leading-[17px] text-[#64748B]">
              <span>
                Document Type
                <span className="font-semibold text-[#13537B]">
                  {" "}
                  : {document.documentType}
                </span>
              </span>
              {document.uploadedAt && <span>{document.uploadedAt}</span>}
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        aria-label={`Download ${document.name}`}
        disabled={!document.documentId || isDownloading}
        onClick={handleDownload}
        className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-black/8 text-[#13537B] transition hover:bg-[#F3F7FA] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <DownloadIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
