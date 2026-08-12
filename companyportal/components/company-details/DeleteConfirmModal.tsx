"use client";

import type { ReactNode } from "react";
import { TrashIcon } from "@/components/home/icons";

type DeleteConfirmModalProps = {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Yes, Delete",
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-[420px] rounded-2xl bg-white px-6 py-8 text-center shadow-xl sm:px-8"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FCEBEB]">
          <TrashIcon className="h-7 w-7 text-[#E13F3F]" />
        </span>

        <h3 className="mt-5 text-[19px] font-bold leading-[23px] text-[#13537B]">
          {title}
        </h3>

        <p className="mt-3 text-[14px] leading-[21px] text-[#64748B]">
          {description}
        </p>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-full border border-black/10 bg-white px-6 py-3 text-[14px] font-semibold text-[#13537B] transition hover:bg-[#F3F7FA]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-full bg-[#E13F3F] px-6 py-3 text-[14px] font-semibold text-white shadow-[0px_6px_20px_rgba(225,63,63,0.4)] transition hover:brightness-95"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
