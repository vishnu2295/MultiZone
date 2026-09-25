"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { errorClass, inputClass, labelClass } from "@/components/register/formStyles";
import type { PersonaConfig } from "@/lib/personas";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+[0-9]{7,15}$/;

// Same dial codes/default used in adminPortalFrontend/BrokerDetails.tsx.
const DIAL_CODES = [
  { code: "+27", flag: "🇿🇦" },
  { code: "+1", flag: "🇺🇸" },
  { code: "+44", flag: "🇬🇧" },
  { code: "+61", flag: "🇦🇺" },
  { code: "+91", flag: "🇮🇳" },
];

export type IdentifierResult = {
  idValue: string;
  email: string;
  /** E.164, e.g. "+27821234567". */
  phone: string;
};

// Raw, not-yet-submitted field values - lifted up to the parent flow so they
// survive navigating away to another step and back (the parent keeps this
// alive across the step's mount/unmount; it's still lost on a page reload).
export type IdentifierDraft = {
  idValue: string;
  email: string;
  dialCode: string;
  phoneNumber: string;
};

const EMPTY_DRAFT: IdentifierDraft = {
  idValue: "",
  email: "",
  dialCode: DIAL_CODES[0].code,
  phoneNumber: "",
};

type IdentifierStepProps = {
  persona: PersonaConfig;
  submitting: boolean;
  onSubmit: (identifier: IdentifierResult) => void;
  draft?: IdentifierDraft;
  onDraftChange?: (draft: IdentifierDraft) => void;
};

type FieldErrors = Partial<Record<"idValue" | "email" | "phone", string>>;

export default function IdentifierStep({
  persona,
  submitting,
  onSubmit,
  draft,
  onDraftChange,
}: IdentifierStepProps) {
  const initial = draft ?? EMPTY_DRAFT;
  const [idValue, setIdValue] = useState(initial.idValue);
  const [email, setEmail] = useState(initial.email);
  const [dialCode, setDialCode] = useState(initial.dialCode);
  const [phoneNumber, setPhoneNumber] = useState(initial.phoneNumber);
  const [errors, setErrors] = useState<FieldErrors>({});

  function updateDraft(next: Partial<IdentifierDraft>) {
    onDraftChange?.({ idValue, email, dialCode, phoneNumber, ...next });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmedId = idValue.trim();
    const trimmedEmail = email.trim();
    // Local numbers are often entered with a leading trunk 0 (e.g. "082...")
    // which isn't part of the E.164 number once the dial code is prefixed.
    const localNumber = phoneNumber.trim().replace(/^0+/, "");
    const combinedPhone = `${dialCode}${localNumber}`;

    const nextErrors: FieldErrors = {};
    if (!trimmedId) {
      nextErrors.idValue = `${persona.identifierLabel.replace(/\.$/, "")} is required.`;
    }
    if (!EMAIL_RE.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!localNumber || !PHONE_RE.test(combinedPhone)) {
      nextErrors.phone = "Enter a valid phone number.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    onSubmit({ idValue: trimmedId, email: trimmedEmail, phone: combinedPhone });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="idValue" className={labelClass}>
          {persona.identifierLabel}
        </label>
        <input
          id="idValue"
          name="idValue"
          type="text"
          value={idValue}
          onChange={(event) => {
            setIdValue(event.target.value);
            updateDraft({ idValue: event.target.value });
          }}
          placeholder={persona.identifierPlaceholder}
          className={inputClass}
          autoComplete="off"
        />
        {errors.idValue ? <p className={errorClass}>{errors.idValue}</p> : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            updateDraft({ email: event.target.value });
          }}
          placeholder="Enter your email address"
          className={inputClass}
          autoComplete="email"
        />
        {errors.email ? <p className={errorClass}>{errors.email}</p> : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="phone" className={labelClass}>
          Phone Number
        </label>
        <div className="flex gap-2">
          <select
            aria-label="Country code"
            value={dialCode}
            onChange={(event) => {
              setDialCode(event.target.value);
              updateDraft({ dialCode: event.target.value });
            }}
            className={`${inputClass.replace("w-full", "w-23")} shrink-0 px-2`}
          >
            {DIAL_CODES.map((d) => (
              <option key={d.code} value={d.code}>
                {d.code}
              </option>
            ))}
          </select>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={phoneNumber}
            onChange={(event) => {
              const next = event.target.value.replace(/[^\d]/g, "");
              setPhoneNumber(next);
              updateDraft({ phoneNumber: next });
            }}
            placeholder="Enter your phone number"
            className={`${inputClass.replace("w-full", "w-0")} flex-1`}
            autoComplete="tel-national"
          />
        </div>
        {errors.phone ? <p className={errorClass}>{errors.phone}</p> : null}
      </div>

      <Button type="submit" disabled={submitting} className="mt-auto w-full">
        {submitting ? "Validating..." : "Next"}
      </Button>
    </form>
  );
}
