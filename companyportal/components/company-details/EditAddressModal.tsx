"use client";

import { useState } from "react";
import { ChevronDownIcon, CloseIcon } from "@/components/home/icons";
import type { CompanyAddress } from "@/content/companyDetails";

const ADDRESS_TYPES: CompanyAddress["type"][] = ["Postal", "Physical", "Delivery"];

const PROVINCES = [
  "Gauteng",
  "Western Cape",
  "KwaZulu-Natal",
  "Eastern Cape",
  "Free State",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
];

const COUNTRIES = ["South Africa"];

export type EditableAddress = CompanyAddress & {
  effectiveFrom?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  country?: string;
};

export interface ApiAddressUpdateRequest {
  type: string | null;
  effectiveFrom: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  province: string | null;
  city: string | null;
  postalCode: string | null;
  country: string | null;
}

export function toApiAddressUpdateRequest(address: EditableAddress): ApiAddressUpdateRequest {
  return {
    type: address.type ?? null,
    effectiveFrom: address.effectiveFrom || null,
    addressLine1: address.addressLine1 || null,
    addressLine2: address.addressLine2 || null,
    province: address.stateProvince || null,
    city: address.city || null,
    postalCode: address.postalCode || null,
    country: address.country || null,
  };
}

type EditAddressModalProps = {
  open: boolean;
  address: EditableAddress | null;
  onClose: () => void;
  onSave: (address: EditableAddress) => void;
};

const emptyForm: EditableAddress = {
  type: "Postal",
  line: "",
  effectiveFrom: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  stateProvince: PROVINCES[0],
  postalCode: "",
  country: COUNTRIES[0],
};

/**
 * Best-effort split of a combined "line" string (the only field the
 * existing address data stores) into the discrete fields the form edits,
 * so previously-saved addresses still show their current details.
 */
function parseAddressLine(line: string) {
  const segments = line
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean);

  let postalCode = "";
  if (segments.length && /^\d+$/.test(segments[segments.length - 1])) {
    postalCode = segments.pop() ?? "";
  }

  let stateProvince = "";
  if (
    segments.length &&
    PROVINCES.some((province) => province.toLowerCase() === segments[segments.length - 1].toLowerCase())
  ) {
    stateProvince = segments.pop() ?? "";
  }

  const city = segments.pop() ?? "";
  const addressLine2 = segments.length > 1 ? segments.pop() ?? "" : "";
  const addressLine1 = segments.join(", ");

  return { addressLine1, addressLine2, city, stateProvince, postalCode };
}

export default function EditAddressModal({
  open,
  address,
  onClose,
  onSave,
}: EditAddressModalProps) {
  const [form, setForm] = useState<EditableAddress>(() => {
    if (!address) return emptyForm;

    // Only fall back to parsing the combined line when the address hasn't
    // already been saved with discrete fields (e.g. its first edit).
    const needsParsing = !address.addressLine1 && address.line;
    const parsed = needsParsing ? parseAddressLine(address.line) : {};

    return { ...emptyForm, ...parsed, ...address };
  });

  if (!open) return null;

  const update = <K extends keyof EditableAddress>(key: K, value: EditableAddress[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const line = [
      form.addressLine1,
      form.addressLine2,
      form.city,
      form.stateProvince,
      form.postalCode,
    ]
      .filter(Boolean)
      .join(", ");

    onSave({ ...form, line: line || form.line });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-[600px] overflow-y-auto rounded-xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-black/5 px-4 py-4 sm:px-6">
          <h3 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
            Edit Address
          </h3>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#13537B] transition hover:bg-[#F3F7FA]"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-x-4 gap-y-4 px-4 py-5 sm:grid-cols-2 sm:px-6">
          <Field label="Type" required>
            <Select
              value={form.type}
              onChange={(value) => update("type", value as CompanyAddress["type"])}
              options={ADDRESS_TYPES}
            />
          </Field>

          <Field label="Effective From" required>
            <input
              type="date"
              value={form.effectiveFrom}
              onChange={(event) => update("effectiveFrom", event.target.value)}
              className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-[13.5px] font-medium text-[#13537B] outline-none placeholder:text-[#94A3B8] focus:border-[#07C1E9] [color-scheme:light]"
            />
          </Field>

          <Field label="Address Line 1" required className="sm:col-span-2">
            <input
              type="text"
              value={form.addressLine1}
              onChange={(event) => update("addressLine1", event.target.value)}
              className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-[13.5px] font-medium text-[#13537B] outline-none focus:border-[#07C1E9]"
            />
          </Field>

          <Field label="Address Line 2">
            <input
              type="text"
              value={form.addressLine2}
              onChange={(event) => update("addressLine2", event.target.value)}
              className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-[13.5px] font-medium text-[#13537B] outline-none focus:border-[#07C1E9]"
            />
          </Field>

          <Field label="State/Province" required>
            <Select
              value={form.stateProvince ?? PROVINCES[0]}
              onChange={(value) => update("stateProvince", value)}
              options={PROVINCES}
            />
          </Field>

          <Field label="City">
            <input
              type="text"
              value={form.city}
              onChange={(event) => update("city", event.target.value)}
              className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-[13.5px] font-medium text-[#13537B] outline-none focus:border-[#07C1E9]"
            />
          </Field>

          <Field label="Postal Code">
            <input
              type="text"
              value={form.postalCode}
              onChange={(event) => update("postalCode", event.target.value)}
              className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-[13.5px] font-medium text-[#13537B] outline-none focus:border-[#07C1E9]"
            />
          </Field>

          <Field label="Country" className="sm:col-span-2">
            <Select
              value={form.country ?? COUNTRIES[0]}
              onChange={(value) => update("country", value)}
              options={COUNTRIES}
            />
          </Field>
        </div>

        <div className="flex flex-col-reverse items-stretch gap-3 border-t border-black/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-black/10 bg-white px-6 py-2.5 text-[13px] font-semibold text-[#13537B] transition hover:bg-[#F3F7FA]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-[#07C1E9] px-6 py-2.5 text-[13px] font-semibold text-white transition hover:brightness-95"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      <label className="text-[13px] font-semibold text-[#13537B]">
        {label} {required && <span className="text-red-500">*</span>}
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
        className="w-full appearance-none rounded-lg border border-black/10 px-4 py-2.5 text-[13.5px] font-medium text-[#13537B] outline-none focus:border-[#07C1E9]"
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
