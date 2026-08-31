"use client";

import { useEffect, useRef, useState } from "react";

import { CloseIcon } from "@/components/common/icons";
import {
  childExtensionStatusFallbackStyle,
  childExtensionStatusStyle,
  commutationStatusModalContent as content,
  mapCommutationValidationDetails,
  PENSIONER_API_BASE_URL,
  type ApiCommutationValidation,
} from "@/content/pensionServices";
import Skeleton from "@/components/ui/Skeleton";
import apiService from "@/lib/api/apiService";
import { getEmployeeCoidId } from "@/lib/auth/employeeClaims";

export interface CommutationStatusModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * "Commutation Status" dialog: title + eligibility pill + close button, then
 * the commutation amount field grid. Mirrors ChildExtensionModal so both
 * status dialogs stay visually consistent.
 */
export default function CommutationStatusModal({
  open,
  onClose,
}: CommutationStatusModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [fields, setFields] = useState<Array<{ label: string; value: string }>>(
    [],
  );

  useEffect(() => {
    if (!open) return;

    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setIsLoading(true);

    async function loadValidation() {
      try {
        const { token, coidId } = await getEmployeeCoidId();
        if (!coidId) return;

        const validation = await apiService.get<ApiCommutationValidation>(
          `${PENSIONER_API_BASE_URL}/pensioner/${coidId}/commutation/validate`,
          { token },
        );

        if (!cancelled) {
          const mapped = mapCommutationValidationDetails(validation);
          setStatus(mapped.status);
          setFields(mapped.fields);
        }
      } catch (error) {
        console.error("Failed to load commutation status:", error);
        if (!cancelled) {
          setStatus("N/A");
          setFields([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadValidation();
    return () => {
      cancelled = true;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#11252D]/30 p-4 py-8 backdrop-blur-[1px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="commutation-status-modal-title"
        onClick={(event) => event.stopPropagation()}
        className="my-auto w-full max-w-[720px] overflow-hidden rounded-2xl bg-white shadow-[13px_20px_48px_rgba(18,46,77,0.18)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#E5EDF2] px-5 py-5 sm:px-8">
          <h2
            id="commutation-status-modal-title"
            className="text-[16px] font-bold leading-snug text-[#13537B] sm:text-[18px]"
          >
            {content.title}
          </h2>

          <div className="flex shrink-0 items-center gap-3 sm:gap-5">
            <span
              className={`rounded-full px-4 py-1.5 text-[13px] font-bold ${
                status
                  ? (childExtensionStatusStyle[status] ??
                    childExtensionStatusFallbackStyle)
                  : childExtensionStatusFallbackStyle
              }`}
            >
              {status ?? <Skeleton className="h-3.5 w-16 align-middle" />}
            </span>
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close dialog"
              onClick={onClose}
              className="flex cursor-pointer h-8 w-8 items-center justify-center rounded-full text-[#3C5564] transition hover:bg-[#F3F7FA]"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="px-5 py-6 sm:px-8 sm:py-7">
          <h3 className="text-[16px] font-bold text-[#24577A] sm:text-[18px]">
            {content.sectionTitle}
          </h3>

          {isLoading ? (
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="min-w-0">
                  <Skeleton className="h-2.5 w-20" />
                  <Skeleton className="mt-2 h-4 w-28" />
                </div>
              ))}
            </div>
          ) : fields.length === 0 ? (
            <p className="mt-6 text-[13px] text-[#6B7F8C]">
              No details available.
            </p>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-3">
              {fields.map((field) => (
                <div key={field.label} className="min-w-0">
                  <p className="text-[11px] font-normal uppercase tracking-[0.6px] text-[#24577A99]">
                    {field.label}
                  </p>
                  <p className="mt-1.5 break-words text-[15px] font-bold text-[#24577A]">
                    {field.value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
