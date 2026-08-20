"use client";

import { useState } from "react";
import { DocumentIcon } from "@/components/home/icons";
import DocumentUploadModal from "@/components/claim-details/DocumentUploadModal";
import type { ClaimUploadDocument } from "@/content/claimDetails";

/**
 * A list of document slots with a single "Upload Documents" action: the modal
 * picks which slot the file belongs to, and the file then shows on that row.
 */
export default function DocumentUploadList({
  title,
  documents,
}: {
  title: string;
  documents: ClaimUploadDocument[];
}) {
  const [rows, setRows] = useState<ClaimUploadDocument[]>(documents);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[16px] font-bold leading-[19px] text-[#13537B]">{title}</h2>

        <button
          type="button"
          onClick={() => setIsUploadOpen(true)}
          className="cursor-pointer rounded-lg bg-[#07C1E9] px-5 py-2.5 text-[13px] font-bold text-white shadow-[0px_4px_16px_rgba(7,193,233,0.35)] transition hover:brightness-95"
        >
          Upload Documents
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {rows.map((row) => (
          <div
            key={row.name}
            className="rounded-2xl bg-white p-4 shadow-[0px_2px_16px_rgba(218,218,218,0.08)]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF6FE]">
                <DocumentIcon className="h-4 w-4 text-[#07C1E9]" />
              </span>

              <div className="flex flex-col gap-0.5">
                <span className="text-[13.5px] font-bold leading-[20px] text-[#13537B]">
                  {row.name}
                </span>

                {row.fileName ? (
                  <span className="flex flex-wrap items-center gap-2 text-[11.5px] leading-[17px] text-[#64748B]">
                    Document Type
                    <span className="font-semibold text-[#13537B]">: {row.fileName}</span>
                    {row.uploadedAt && <span>{row.uploadedAt}</span>}
                  </span>
                ) : (
                  <span className="text-[11.5px] leading-[17px] text-[#94A3B8]">
                    No document uploaded
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <DocumentUploadModal
        key={isUploadOpen ? "open" : "closed"}
        open={isUploadOpen}
        documentNames={rows.map((row) => row.name)}
        onClose={() => setIsUploadOpen(false)}
        onSave={({ documentName, fileName, uploadedAt }) => {
          setRows((prev) =>
            prev.map((row) =>
              row.name === documentName ? { ...row, fileName, uploadedAt } : row,
            ),
          );
          setIsUploadOpen(false);
        }}
      />
    </div>
  );
}
