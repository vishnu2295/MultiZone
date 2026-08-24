"use client";

import { useState } from "react";
import { ChevronDownIcon, CloseIcon } from "@/components/home/icons";

const DATE_RANGE_PRESETS = [
  "Today",
  "All Time",
  "This Week",
  "Last Week",
  "This Month",
  "Last Month",
  "This Year",
  "Last 30 Days",
  "Last 90 Days",
] as const;

// Not yet sent to the API — the remittanceDocument endpoint doesn't accept a
// payment type filter yet (backend change in progress). Kept in the form so
// the UI matches the design; wire it into the request once that ships.
const PAYMENT_TYPES = [
  // "All",
  "Claim",
  "Commission",
  "Refund",
  "Tracing Fee",
  "Europe Assist Fee",
] as const;

const DEFAULT_PRESET: (typeof DATE_RANGE_PRESETS)[number] = "All Time";

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/** Computes the {fromDate, toDate} pair (yyyy-mm-dd) for a preset label. */
function computeDateRange(preset: string): {
  fromDate: string;
  toDate: string;
} {
  const today = startOfDay(new Date());
  const dayOfWeek = today.getDay(); // 0 = Sunday .. 6 = Saturday
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const thisMonday = addDays(today, -daysSinceMonday);

  switch (preset) {
    case "Today":
      return { fromDate: toIsoDate(today), toDate: toIsoDate(today) };
    case "This Week":
      return { fromDate: toIsoDate(thisMonday), toDate: toIsoDate(today) };
    case "Last Week": {
      const lastMonday = addDays(thisMonday, -7);
      const lastSunday = addDays(thisMonday, -1);
      return { fromDate: toIsoDate(lastMonday), toDate: toIsoDate(lastSunday) };
    }
    case "This Month": {
      const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      return { fromDate: toIsoDate(firstOfMonth), toDate: toIsoDate(today) };
    }
    case "Last Month": {
      const firstOfLastMonth = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1,
      );
      const lastOfLastMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        0,
      );
      return {
        fromDate: toIsoDate(firstOfLastMonth),
        toDate: toIsoDate(lastOfLastMonth),
      };
    }
    case "This Year": {
      const firstOfYear = new Date(today.getFullYear(), 0, 1);
      return { fromDate: toIsoDate(firstOfYear), toDate: toIsoDate(today) };
    }
    case "Last 30 Days":
      return {
        fromDate: toIsoDate(addDays(today, -29)),
        toDate: toIsoDate(today),
      };
    case "Last 90 Days":
      return {
        fromDate: toIsoDate(addDays(today, -89)),
        toDate: toIsoDate(today),
      };
    case "All Time":
    default:
      return { fromDate: "", toDate: "" };
  }
}

export type RemittanceDownloadFilters = {
  fromDate: string;
  toDate: string;
  paymentType: string;
};

type DownloadRemittanceModalProps = {
  open: boolean;
  onClose: () => void;
  onDownload: (filters: RemittanceDownloadFilters) => Promise<void>;
};

export default function DownloadRemittanceModal({
  open,
  onClose,
  onDownload,
}: DownloadRemittanceModalProps) {
  const [preset, setPreset] = useState<string>(DEFAULT_PRESET);
  const [paymentType, setPaymentType] = useState<string>(PAYMENT_TYPES[0]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  if (!open) return null;

  const reset = () => {
    setPreset(DEFAULT_PRESET);
    setPaymentType(PAYMENT_TYPES[0]);
    setFromDate("");
    setToDate("");
    setIsDownloading(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handlePresetChange = (value: string) => {
    setPreset(value);
    const range = computeDateRange(value);
    setFromDate(range.fromDate);
    setToDate(range.toDate);
  };

  const isFormValid =
    Boolean(fromDate) && Boolean(toDate) && Boolean(paymentType);

  const handleDownloadClick = async () => {
    setIsDownloading(true);
    try {
      await onDownload({ fromDate, toDate, paymentType });
      reset();
      onClose();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-[440px] max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-black/5 px-4 py-4 sm:px-6">
          <h3 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
            Download Remittance
          </h3>
          <button
            type="button"
            aria-label="Close"
            onClick={handleClose}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-[#13537B] transition hover:bg-[#F3F7FA]"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-4 py-5 sm:px-6">
          <Field label="Pre-defined Date Range">
            <Select
              value={preset}
              onChange={handlePresetChange}
              options={DATE_RANGE_PRESETS}
            />
          </Field>

          <Field label="Payment Type" required>
            <Select
              value={paymentType}
              onChange={setPaymentType}
              options={PAYMENT_TYPES}
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Start Date" required>
              <input
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                required
                className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-[13.5px] font-medium text-[#13537B] outline-none focus:border-[#07C1E9] [color-scheme:light]"
              />
            </Field>

            <Field label="End Date" required>
              <input
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
                required
                className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-[13.5px] font-medium text-[#13537B] outline-none focus:border-[#07C1E9] [color-scheme:light]"
              />
            </Field>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-black/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={handleClose}
            className="w-full cursor-pointer rounded-md border border-black/10 bg-white px-6 py-2.5 text-[13px] font-semibold text-[#13537B] transition hover:bg-[#F3F7FA] sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDownloadClick}
            disabled={isDownloading || !isFormValid}
            className="w-full cursor-pointer rounded-md bg-[#07C1E9] px-6 py-2.5 text-[13px] font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {isDownloading ? "Downloading..." : "Download"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] font-semibold text-[#13537B]">
        {label}
        {required && <span className="text-[#E77B7B]"> *</span>}
      </label>
      {children}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full cursor-pointer appearance-none rounded-lg border border-black/10 px-4 py-2.5 text-[13.5px] font-medium text-[#13537B] outline-none focus:border-[#07C1E9]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#13537B]" />
    </div>
  );
}
