"use client";

import { useEffect, useRef } from "react";

import { CloseIcon } from "@/components/common/icons";
import {
  childExtensionRequest as request,
  childExtensionStatusStyle,
} from "@/content/pensionServices";

export interface ChildExtensionModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * "Child Extension Request Status" dialog: title + status pill + close button,
 * then the demographics detail grid. Closes on Escape, on backdrop click, and
 * via the close button.
 */
export default function ChildExtensionModal({
  open,
  onClose,
}: ChildExtensionModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    // Keep the page behind the dialog from scrolling while it is open.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#11252D]/30 p-4 py-8 backdrop-blur-[1px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="child-extension-modal-title"
        onClick={(event) => event.stopPropagation()}
        className="my-auto w-full max-w-[1120px] overflow-hidden rounded-2xl bg-white shadow-[13px_20px_48px_rgba(18,46,77,0.18)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#E5EDF2] px-5 py-5 sm:px-8">
          <h2
            id="child-extension-modal-title"
            className="text-[16px] font-bold leading-snug text-[#13537B] sm:text-[18px]"
          >
            {request.title}
          </h2>

          <div className="flex shrink-0 items-center gap-3 sm:gap-5">
            <span
              className={`rounded-full px-4 py-1.5 text-[13px] font-bold italic ${childExtensionStatusStyle[request.status]}`}
            >
              {request.status}
            </span>
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close dialog"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#3C5564] transition hover:bg-[#F3F7FA]"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="px-5 py-6 sm:px-8 sm:py-7">
          <h3 className="text-[16px] font-bold text-[#13537B] sm:text-[18px]">
            {request.sectionTitle}
          </h3>

          {request.groups.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className={
                groupIndex === 0
                  ? "mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4"
                  : "mt-8 grid grid-cols-1 gap-x-6 gap-y-6 border-t border-[#E5EDF2] pt-8 sm:grid-cols-2 lg:grid-cols-4"
              }
            >
              {group.map((field) => (
                <div key={field.label} className="min-w-0">
                  <p className="text-[11px] font-normal uppercase tracking-[0.6px] text-[#6B7F8C]">
                    {field.label}
                  </p>
                  <p className="mt-1.5 break-words text-[15px] font-bold text-[#13537B]">
                    {field.value}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
