"use client";

import { useState } from "react";
import { ChevronDownIcon, CloseIcon } from "@/components/home/icons";
import type { CompanyContact } from "@/content/companyDetails";

const TITLES = ["Mr", "Mrs", "Miss", "Ms", "Dr"];
const COMMUNICATION_TYPES = ["Email", "Phone"];
const DESIGNATIONS = [
  "Primary Contact",
  "HR Contact",
  "Finance Contact",
  "Operations Contact",
];
const CONTRACT_CONTEXTS = ["Primary Contact", "Secondary Contact", "Billing Contact"];

export type EditableContact = CompanyContact & {
  title?: string;
  firstName?: string;
  surname?: string;
  communicationType?: string;
  contactNo?: string;
  designation?: string;
  contractContext?: string;
};

export interface ApiContactUpdateRequest {
  title: string | null;
  firstname: string | null;
  surname: string | null;
  communicationType: string | null;
  contactNumber: string | null;
  emailAddress: string | null;
  contactDesignation: string | null;
  contactContext: string | null;
}

export function toApiContactUpdateRequest(contact: EditableContact): ApiContactUpdateRequest {
  return {
    title: contact.title ?? null,
    firstname: contact.firstName ?? null,
    surname: contact.surname ?? null,
    communicationType: contact.communicationType ?? null,
    contactNumber: contact.contactNo ?? null,
    emailAddress: contact.email || null,
    contactDesignation: contact.designation ?? null,
    contactContext: contact.contractContext ?? null,
  };
}

type EditContactModalProps = {
  open: boolean;
  contact: EditableContact | null;
  onClose: () => void;
  onSave: (contact: EditableContact) => void;
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
  designation: DESIGNATIONS[0],
  contractContext: CONTRACT_CONTEXTS[0],
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
  const title = TITLES.find((t) => t.toLowerCase() === rawTitle.toLowerCase()) ?? TITLES[0];
  const [firstName, ...surnameParts] = rest.split(" ");
  return { title, firstName, surname: surnameParts.join(" ") };
}

export default function EditContactModal({
  open,
  contact,
  onClose,
  onSave,
}: EditContactModalProps) {
  const [form, setForm] = useState<EditableContact>(() => {
    if (!contact) return emptyForm;

    const needsParsing = !contact.firstName && contact.name;
    const parsed = needsParsing ? parseContactName(contact.name) : {};

    return {
      ...emptyForm,
      ...parsed,
      contactNo: contact.phone,
      designation: DESIGNATIONS.find((d) => d.startsWith(contact.badge)) ?? DESIGNATIONS[0],
      ...contact,
    };
  });

  if (!open) return null;

  const update = <K extends keyof EditableContact>(key: K, value: EditableContact[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const name = [form.title ? `${form.title}.` : "", form.firstName, form.surname]
      .filter(Boolean)
      .join(" ");
    const badge = (form.designation ?? "").split(" ")[0] || form.badge;

    onSave({
      ...form,
      name: name || form.name,
      badge,
      email: form.email,
      phone: form.contactNo || form.phone,
    });
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
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#13537B] transition hover:bg-[#F3F7FA]"
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
                value={form.designation ?? DESIGNATIONS[0]}
                onChange={(value) => update("designation", value)}
                options={DESIGNATIONS}
              />
            </Field>
          </div>

          <Field label="Contract Context">
            <Select
              value={form.contractContext ?? CONTRACT_CONTEXTS[0]}
              onChange={(value) => update("contractContext", value)}
              options={CONTRACT_CONTEXTS}
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
