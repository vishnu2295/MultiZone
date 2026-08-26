"use client";

import { useState } from "react";
import DocumentRow from "@/components/claim-details/panels/DocumentRow";
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
        {rows.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-center text-[13px] font-normal text-[#64748B] shadow-[0px_2px_16px_rgba(218,218,218,0.08)]">
            No documents found/uploaded.
          </div>
        ) : (
          rows.map((row) => (
            <DocumentRow
              key={row.name}
              document={{
                documentId: row.documentId,
                name: row.name,
                documentType: row.fileName,
                uploadedAt: row.uploadedAt,
              }}
            />
          ))
        )}
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
