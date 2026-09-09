"use client";

import { DocumentIcon, DownloadIcon } from "@/components/home/icons";
import { dummyPolicyDocuments } from "@/content/policyDetails";

export default function PolicyDocumentsPanel() {
  if (dummyPolicyDocuments.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-6 text-center text-[13px] font-normal text-[#64748B] shadow-[0px_2px_16px_rgba(218,218,218,0.08)]">
        There are no documents to display.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {dummyPolicyDocuments.map((document) => (
        <div
          key={document.id}
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
              {document.year && (
                <span className="text-[11.5px] leading-[17px] text-[#64748B]">
                  Year : {document.year}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            aria-label={`Download ${document.name}`}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-black/8 text-[#13537B] transition hover:bg-[#F3F7FA]"
          >
            <DownloadIcon className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
