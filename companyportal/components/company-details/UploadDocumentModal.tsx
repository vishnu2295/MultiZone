"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";
import {
  ChevronDownIcon,
  CloseIcon,
  DocumentIcon,
  UploadIcon,
} from "@/components/home/icons";
import type { DocumentSetEnum } from "@/lib/constants";
import type { ApiDocumentSet } from "@/content/companyDetails";

type UploadDocumentModalProps = {
  open: boolean;
  documentSetOptions: readonly { label: string; value: DocumentSetEnum }[];
  fetchDocumentTypes: (documentSet: DocumentSetEnum) => Promise<ApiDocumentSet[]>;
  onClose: () => void;
  onSave: (
    file: File,
    documentSet: DocumentSetEnum,
    documentType: ApiDocumentSet,
  ) => Promise<void>;
};

export default function UploadDocumentModal({
  open,
  documentSetOptions,
  fetchDocumentTypes,
  onClose,
  onSave,
}: UploadDocumentModalProps) {
  const [documentSet, setDocumentSet] = useState(documentSetOptions[0]?.value);
  const [documentTypes, setDocumentTypes] = useState<ApiDocumentSet[]>([]);
  const [documentTypeId, setDocumentTypeId] = useState<number | undefined>();
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || documentSet === undefined) return;
    const selectedDocumentSet = documentSet;

    let cancelled = false;

    async function loadDocumentTypes() {
      setIsLoadingTypes(true);
      setDocumentTypeId(undefined);

      try {
        const types = await fetchDocumentTypes(selectedDocumentSet);
        if (cancelled) return;
        setDocumentTypes(types);
        setDocumentTypeId(types[0]?.id);
      } catch (error) {
        console.error("Failed to load document types:", error);
        if (!cancelled) setDocumentTypes([]);
      } finally {
        if (!cancelled) setIsLoadingTypes(false);
      }
    }

    loadDocumentTypes();
    return () => {
      cancelled = true;
    };
  }, [open, documentSet, fetchDocumentTypes]);

  if (!open) return null;

  const reset = () => {
    setSelectedFile(null);
    setDocumentSet(documentSetOptions[0]?.value);
    setIsDragging(false);
    setIsSaving(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleSave = async () => {
    const documentType = documentTypes.find((type) => type.id === documentTypeId);
    if (!selectedFile || documentSet === undefined || !documentType) return;
    setIsSaving(true);
    try {
      await onSave(selectedFile, documentSet, documentType);
      reset();
    } finally {
      setIsSaving(false);
    }
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
        <div className="flex cursor-pointer items-center justify-between border-b border-black/5 px-6 py-4">
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
            Document Set <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={documentSet ?? ""}
              onChange={(event) => setDocumentSet(Number(event.target.value))}
              className="w-full cursor-pointer appearance-none rounded-lg border border-black/10 px-4 py-2.5 text-[13.5px] font-medium text-[#13537B] outline-none focus:border-[#07C1E9]"
            >
              {documentSetOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#13537B]" />
          </div>
        </div>

        <div className="flex flex-col gap-2 px-6 pb-5">
          <label className="text-[13px] font-semibold text-[#13537B]">
            Document Type <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={documentTypeId ?? ""}
              onChange={(event) => setDocumentTypeId(Number(event.target.value))}
              disabled={isLoadingTypes || documentTypes.length === 0}
              className="w-full cursor-pointer appearance-none rounded-lg border border-black/10 px-4 py-2.5 text-[13.5px] font-medium text-[#13537B] outline-none focus:border-[#07C1E9] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {documentTypes.length === 0 ? (
                <option value="">
                  {isLoadingTypes ? "Loading document types..." : "No document types available"}
                </option>
              ) : (
                documentTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))
              )}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#13537B]" />
          </div>
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
                    {selectedFile.name.replace(/\.[^/.]+$/, "")}
                  </span>
                  <span className="text-[12px] text-[#64748B]">
                    {new Date().toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    &middot; {selectedFile.name.split(".").pop()}
                  </span>
                </div>
              </div>
              <button
                type="button"
                aria-label="Remove file"
                onClick={() => setSelectedFile(null)}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-red-100 text-red-500 transition hover:bg-red-50"
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
                  className="font-semibold text-[#07C1E9] underline-offset-2 hover:underline"
                >
                  browse files
                </button>{" "}
                &middot; PDF, JPG, PNG up to 20MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) setSelectedFile(file);
                }}
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-black/5 px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md border cursor-pointer border-black/10 bg-white px-6 py-2.5 text-[13px] font-semibold text-[#13537B] transition hover:bg-[#F3F7FA]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!selectedFile || documentTypeId === undefined || isSaving}
            className="rounded-md cursor-pointer bg-[#07C1E9] px-6 py-2.5 text-[13px] font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Uploading..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
