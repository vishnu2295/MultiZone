"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, CloseIcon } from "@/components/home/icons";
import type {
  ApiContactDetails,
  ApiRolePlayerContactInformation,
  CompanyContact,
} from "@/content/companyDetails";
import { contactContextOptions, designationOptions } from "@/lib/constants";
import { useCompanyProfile } from "@/lib/context/CompanyProfileContext";

const TITLES = ["Mr", "Mrs", "Miss", "Ms", "Dr"];
const COMMUNICATION_TYPES = ["Email", "Phone"];

export type EditableContact = CompanyContact & {
  raw?: ApiContactDetails;
  rolePlayerContactId?: number;
  title?: string;
  firstName?: string;
  surname?: string;
  communicationType?: string;
  contactNo?: string;
  designation?: string;
  contactContext?: string[];
  rolePlayerContactInformations?: ApiRolePlayerContactInformation[];
  isDeleted?: boolean;
};

export function applyContactContextSelection(
  contact: EditableContact,
  selected: string[],
  actingUser?: string | null,
): ApiRolePlayerContactInformation[] {
  const existing = contact.rolePlayerContactInformations ?? [];
  const now = new Date().toISOString();

  const updated = existing
    .map((info) => {
      const shouldBeActive =
        info.contactInformationType != null && selected.includes(info.contactInformationType);
      const nextIsDeleted = !shouldBeActive;
      // Only stamp modifiedBy/modifiedDate for entries whose state this
      // selection actually changed — leave untouched ones as they were.
      if (nextIsDeleted === info.isDeleted) return info;
      return {
        ...info,
        isDeleted: nextIsDeleted,
        modifiedBy: actingUser ?? info.modifiedBy ?? null,
        modifiedDate: now,
      };
    })
    .filter((info) => !(info.isDeleted && info.rolePlayerContactInformationId === 0));

  const existingTypes = new Set(
    existing.map((info) => info.contactInformationType).filter((type) => type != null),
  );
  const additions: ApiRolePlayerContactInformation[] = selected
    .filter((value) => !existingTypes.has(value))
    .map((value) => ({
      rolePlayerContactInformationId: 0,
      rolePlayerContactId: contact.rolePlayerContactId ?? 0,
      contactInformationType: value,
      isDeleted: false,
      createdBy: actingUser ?? null,
      createdDate: now,
      modifiedBy: actingUser ?? null,
      modifiedDate: now,
    }));

  return [...updated, ...additions];
}

export function toApiContactDetails(contact: EditableContact): ApiContactDetails {
  return {
    ...contact.raw,
    rolePlayerContactId: contact.rolePlayerContactId,
    title: contact.title ?? null,
    firstname: contact.firstName ?? null,
    surname: contact.surname ?? null,
    communicationType: contact.communicationType ?? null,
    contactNumber: contact.contactNo ?? null,
    emailAddress: contact.email || null,
    contactDesignationType: contact.designation
      ? contact.designation.replace(/\s+/g, "")
      : null,
    isDeleted: contact.isDeleted ?? false,
    rolePlayerContactInformations: contact.rolePlayerContactInformations ?? [],
  };
}

type EditContactModalProps = {
  open: boolean;
  contact: EditableContact | null;
  onClose: () => void;
  onSave: (contact: EditableContact) => void | Promise<void>;
};

const emptyForm: EditableContact = {
  name: "",
  badge: "",
  email: "",
  phone: "",
  title: TITLES[0],
  firstName: "",
  surname: "",
  communicationType: COMMUNICATION_TYPES[0],
  contactNo: "",
  designation: designationOptions[0],
  contactContext: [],
  rolePlayerContactInformations: [],
};

/**
 * Best-effort split of the combined "name" string (e.g. "Mr. Sarah Johnson")
 * into title/first name/surname, so previously-saved contacts still show
 * their current details the first time they're edited.
 */
function parseContactName(name: string) {
  const match = name.match(/^([A-Za-z]+)\.?\s+(.*)$/);
  if (!match) return { title: TITLES[0], firstName: name, surname: "" };

  const [, rawTitle, rest] = match;
  const title =
    TITLES.find((t) => t.toLowerCase() === rawTitle.toLowerCase()) ?? TITLES[0];
  const [firstName, ...surnameParts] = rest.split(" ");
  return { title, firstName, surname: surnameParts.join(" ") };
}

export default function EditContactModal({
  open,
  contact,
  onClose,
  onSave,
}: EditContactModalProps) {
  const { userEmail } = useCompanyProfile();
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<EditableContact>(() => {
    if (!contact) return emptyForm;

    const needsParsing = !contact.firstName && contact.name;
    const parsed = needsParsing ? parseContactName(contact.name) : {};

    return {
      ...emptyForm,
      ...parsed,
      contactNo: contact.phone,
      designation:
        designationOptions.find((d) => d.startsWith(contact.badge)) ??
        designationOptions[0],
      ...contact,
    };
  });

  if (!open) return null;

  const update = <K extends keyof EditableContact>(
    key: K,
    value: EditableContact[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateContactContext = (selected: string[]) => {
    setForm((prev) => ({
      ...prev,
      contactContext: selected,
      rolePlayerContactInformations: applyContactContextSelection(prev, selected, userEmail),
    }));
  };

  const handleSave = async () => {
    const name = [
      form.title ? `${form.title}.` : "",
      form.firstName,
      form.surname,
    ]
      .filter(Boolean)
      .join(" ");
    const badge = (form.designation ?? "").split(" ")[0] || form.badge;

    setIsSaving(true);
    try {
      await onSave({
        ...form,
        name: name || form.name,
        badge,
        email: form.email,
        phone: form.contactNo || form.phone,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-[640px] overflow-y-auto rounded-xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-black/5 px-4 py-4 sm:px-6">
          <h3 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
            Edit Contact
          </h3>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            disabled={isSaving}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-[#13537B] transition hover:bg-[#F3F7FA] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-3">
            <Field label="Title" required>
              <Select
                value={form.title ?? TITLES[0]}
                onChange={(value) => update("title", value)}
                options={TITLES}
              />
            </Field>

            <Field label="First Name" required>
              <input
                type="text"
                value={form.firstName}
                onChange={(event) => update("firstName", event.target.value)}
                className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-[13.5px] font-medium text-[#13537B] outline-none focus:border-[#07C1E9]"
              />
            </Field>

            <Field label="Surname" required>
              <input
                type="text"
                value={form.surname}
                onChange={(event) => update("surname", event.target.value)}
                className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-[13.5px] font-medium text-[#13537B] outline-none focus:border-[#07C1E9]"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <Field label="Communication Type" required>
              <Select
                value={form.communicationType ?? COMMUNICATION_TYPES[0]}
                onChange={(value) => update("communicationType", value)}
                options={COMMUNICATION_TYPES}
              />
            </Field>

            <Field label="Contact No" required>
              <input
                type="tel"
                value={form.contactNo}
                onChange={(event) => update("contactNo", event.target.value)}
                className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-[13.5px] font-medium text-[#13537B] outline-none focus:border-[#07C1E9]"
              />
            </Field>

            <Field label="Email Address">
              <input
                type="email"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
                className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-[13.5px] font-medium text-[#13537B] outline-none focus:border-[#07C1E9]"
              />
            </Field>

            <Field label="Designation" required>
              <Select
                value={form.designation ?? designationOptions[0]}
                onChange={(value) => update("designation", value)}
                options={designationOptions}
              />
            </Field>
          </div>

          <Field label="Contact Context">
            <MultiSelect
              value={form.contactContext ?? []}
              onChange={updateContactContext}
              options={contactContextOptions}
            />
          </Field>
        </div>

        <div className="flex flex-col-reverse items-stretch gap-3 border-t border-black/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-md cursor-pointer border border-black/10 bg-white px-6 py-2.5 text-[13px] font-semibold text-[#13537B] transition hover:bg-[#F3F7FA] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-md bg-[#07C1E9] px-6 py-2.5 text-[13px] font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving && <SpinnerIcon className="h-3.5 w-3.5" />}
            {isSaving ? "Saving..." : "Save Changes"}
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

function MultiSelect({
  value,
  onChange,
  options,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  options: readonly { label: string; value: string }[];
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = (optionValue: string) => {
    onChange(
      value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue],
    );
  };

  const selectedLabels = options.filter((option) => value.includes(option.value));

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex min-h-[42px] w-full flex-wrap items-center gap-1.5 rounded-lg border border-black/10 px-3 py-2 text-left text-[13.5px] font-medium text-[#13537B] outline-none focus:border-[#07C1E9]"
      >
        {selectedLabels.length === 0 ? (
          <span className="px-1 text-[#94A3B8]">Select contact context</span>
        ) : (
          selectedLabels.map((option) => (
            <span
              key={option.value}
              className="rounded-full bg-[#F0FAFE] px-2.5 py-1 text-[12px] font-semibold text-[#13537B]"
            >
              {option.label}
            </span>
          ))
        )}
        <ChevronDownIcon className="ml-auto h-4 w-4 shrink-0 text-[#13537B]" />
      </button>

      {open && (
        <div className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-black/10 bg-white py-1 shadow-lg">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2.5 px-4 py-2 text-[13.5px] text-[#13537B] hover:bg-[#F3F7FA]"
            >
              <input
                type="checkbox"
                checked={value.includes(option.value)}
                onChange={() => toggle(option.value)}
                className="h-4 w-4 rounded border-black/20 accent-[#07C1E9]"
              />
              {option.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className ?? ""}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
