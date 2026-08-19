"use client";

import { useRef, useState, type DragEvent } from "react";
import { ChevronDownIcon, CloseIcon, DocumentIcon, UploadIcon } from "@/components/home/icons";

const ACCEPTED_EXTENSIONS = ["pdf", "xlsx"];

export type DocumentUpload = {
  documentName: string;
  fileName: string;
  uploadedAt: string;
};

type DocumentUploadModalProps = {
  open: boolean;
  /** Document slots the file can be attached to. A single entry locks the target. */
  documentNames: readonly string[];
  onClose: () => void;
  onSave: (upload: DocumentUpload) => void;
};

function formatUploadedAt(date: Date) {
  const day = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = date
    .toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true })
    .toLowerCase();

  return `${day} · ${time}`;
}

export default function DocumentUploadModal({
  open,
  documentNames,
  onClose,
  onSave,
}: DocumentUploadModalProps) {
  const [documentName, setDocumentName] = useState(documentNames[0]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const reset = () => {
    setSelectedFile(null);
    setDocumentName(documentNames[0]);
    setIsDragging(false);
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const acceptFile = (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!ACCEPTED_EXTENSIONS.includes(extension)) {
      setError("Only PDF and XLSX files are allowed.");
      setSelectedFile(null);
      return;
    }

    setError(null);
    setSelectedFile(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) acceptFile(file);
  };

  const handleSave = () => {
    if (!selectedFile) return;

    onSave({
      documentName,
      fileName: selectedFile.name,
      uploadedAt: formatUploadedAt(new Date()),
    });
    reset();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-[550px] rounded-xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-black/5 px-6 py-4">
          <h3 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
            Upload Document
          </h3>
          <button
            type="button"
            aria-label="Close"
            onClick={handleClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-[#13537B] transition hover:bg-[#F3F7FA]"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-2 px-6 py-5">
          <label className="text-[13px] font-semibold text-[#13537B]">
            Document <span className="text-red-500">*</span>
          </label>
          {documentNames.length === 1 ? (
            <p className="rounded-lg border border-black/10 bg-[#F8FAFC] px-4 py-2.5 text-[13.5px] font-medium text-[#13537B]">
              {documentNames[0]}
            </p>
          ) : (
            <div className="relative">
              <select
                value={documentName}
                onChange={(event) => setDocumentName(event.target.value)}
                className="w-full appearance-none rounded-lg border border-black/10 px-4 py-2.5 text-[13.5px] font-medium text-[#13537B] outline-none focus:border-[#07C1E9]"
              >
                {documentNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#13537B]" />
            </div>
          )}
        </div>

        <div className="px-6 pb-6">
          {selectedFile ? (
            <div className="flex items-center justify-between rounded-lg border border-black/10 p-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#EAF6FE]">
                  <DocumentIcon className="h-4 w-4 text-[#07C1E9]" />
                </span>
                <div className="flex flex-col">
                  <span className="text-[13.5px] font-semibold text-[#13537B]">
                    {selectedFile.name}
                  </span>
                  <span className="text-[12px] text-[#64748B]">
                    {(selectedFile.size / 1024).toFixed(0)} KB
                  </span>
                </div>
              </div>
              <button
                type="button"
                aria-label="Remove file"
                onClick={() => setSelectedFile(null)}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-red-100 text-red-500 transition hover:bg-red-50"
              >
                <CloseIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-6 py-10 text-center transition ${
                isDragging ? "border-[#07C1E9] bg-[#F0FAFE]" : "border-black/15"
              }`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EAF6FE] text-[#07C1E9]">
                <UploadIcon className="h-5 w-5" />
              </span>
              <p className="text-[14px] font-semibold text-[#13537B]">
                Drag &amp; drop documents
              </p>
              <p className="text-[12.5px] text-[#64748B]">
                or{" "}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer font-semibold text-[#07C1E9] underline-offset-2 hover:underline"
                >
                  browse files
                </button>{" "}
                &middot; PDF or XLSX
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.xlsx,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) acceptFile(file);
                  event.target.value = "";
                }}
              />
            </div>
          )}

          {error && <p className="mt-3 text-[12.5px] font-medium text-[#E13F3F]">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-black/5 px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="cursor-pointer rounded-md border border-black/10 bg-white px-6 py-2.5 text-[13px] font-semibold text-[#13537B] transition hover:bg-[#F3F7FA]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!selectedFile}
            className="cursor-pointer rounded-md bg-[#07C1E9] px-6 py-2.5 text-[13px] font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
