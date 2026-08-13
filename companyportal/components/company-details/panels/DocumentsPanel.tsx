"use client";

import { useState } from "react";
import { companyDetailsContent } from "@/content/companyDetails";
import { DocumentIcon, DownloadIcon } from "@/components/home/icons";
import UploadDocumentModal from "@/components/company-details/UploadDocumentModal";

export default function DocumentsPanel() {
  const [documents, setDocuments] = useState(companyDetailsContent.documents);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
          Documents
        </h2>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg cursor-pointer bg-[#07C1E9] px-5 py-2.5 text-[13px] font-bold text-white shadow-[0px_4px_16px_rgba(7,193,233,0.35)] transition hover:brightness-95"
        >
          Upload Documents
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {documents.map((document, index) => (
          <div
            key={`${document.name}-${index}`}
            className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-[0px_2px_16px_rgba(218,218,218,0.08)]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EAF6FE]">
                <DocumentIcon className="h-5 w-5 text-[#07C1E9]" />
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-[15px] font-bold leading-[19px] text-[#13537B]">
                  {document.name}
                </span>
                <span className="flex items-center gap-2 text-[13px] leading-[18px] text-[#64748B]">
                  Document Type
                  <span className="font-semibold text-[#13537B]">
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
              className="flex h-10 w-10 cursor-pointer shrink-0 items-center justify-center rounded-lg border border-black/8 text-[#13537B] transition hover:bg-[#F3F7FA]"
            >
              <DownloadIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <UploadDocumentModal
        open={isModalOpen}
        documentTypes={companyDetailsContent.documentTypes}
        onClose={() => setIsModalOpen(false)}
        onSave={(document) => {
          setDocuments((prev) => [document, ...prev]);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
