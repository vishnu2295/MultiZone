"use client";

import { useState } from "react";
import DocumentRow from "@/components/claim-details/panels/DocumentRow";
import DocumentUploadModal from "@/components/claim-details/DocumentUploadModal";
import {
  formatDocumentTimestamp,
  type ApiClaimDocument,
  type ClaimUploadDocument,
} from "@/content/claimDetails";
import apiService from "@/lib/api/apiService";
import { useCompanyProfile } from "@/lib/context/CompanyProfileContext";

/**
 * A list of document slots with a single "Upload Documents" action: the modal
 * picks which slot the file belongs to, and the file then shows on that row.
 */
export default function DocumentUploadList({
  title,
  documents,
  claimId,
}: {
  title: string;
  documents: ClaimUploadDocument[];
  claimId: string;
}) {
  const { token } = useCompanyProfile();
  const [rows, setRows] = useState<ClaimUploadDocument[]>(documents);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  async function handleUpload(file: File, documentName: string) {
    const formData = new FormData();
    // ASP.NET model-binds a multipart array of complex objects via
    // indexed keys, so a single-item array is `documents[0].<field>`.
    formData.append("documents[0].documentKeySet", documentName);
    formData.append("documents[0].documentType", title);
    formData.append("documents[0].file", file, file.name);

    const [uploaded] = await apiService.post<ApiClaimDocument[]>(
      `/employer/documents/${claimId}`,
      formData,
      { token: token ?? undefined },
    );

    setRows((prev) =>
      prev.map((row) =>
        row.name === documentName
          ? {
              ...row,
              documentId: uploaded.documentId,
              fileName: uploaded.fileName,
              uploadedAt: formatDocumentTimestamp(uploaded.uploadedDate),
            }
          : row,
      ),
    );
  }

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
        onSave={async (file, documentName) => {
          await handleUpload(file, documentName);
          setIsUploadOpen(false);
        }}
      />
    </div>
  );
}
