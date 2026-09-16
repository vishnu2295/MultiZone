"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { errorClass, inputClass, labelClass } from "@/components/register/formStyles";
import type { PersonaConfig } from "@/lib/personas";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9]{7,15}$/;

export type IdentifierResult = {
  idValue: string;
  email: string;
  phone: string;
};

type IdentifierStepProps = {
  persona: PersonaConfig;
  submitting: boolean;
  onSubmit: (identifier: IdentifierResult) => void;
};

type FieldErrors = Partial<Record<"idValue" | "email" | "phone", string>>;

export default function IdentifierStep({
  persona,
  submitting,
  onSubmit,
}: IdentifierStepProps) {
  const [idValue, setIdValue] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmedId = idValue.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    const nextErrors: FieldErrors = {};
    if (!trimmedId) {
      nextErrors.idValue = `${persona.identifierLabel} is required.`;
    }
    if (!EMAIL_RE.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!PHONE_RE.test(trimmedPhone)) {
      nextErrors.phone = "Enter a valid phone number.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    onSubmit({ idValue: trimmedId, email: trimmedEmail, phone: trimmedPhone });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="idValue" className={labelClass}>
          {persona.identifierLabel}
        </label>
        <input
          id="idValue"
          name="idValue"
          type="text"
          value={idValue}
          onChange={(event) => setIdValue(event.target.value)}
          placeholder={
            persona.identifierKind === "id-number" ? "e.g. 8801015800082" : "e.g. 123456789"
          }
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
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@example.com"
          className={inputClass}
          autoComplete="email"
        />
        {errors.email ? <p className={errorClass}>{errors.email}</p> : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="phone" className={labelClass}>
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+27 82 123 4567"
          className={inputClass}
          autoComplete="tel"
        />
        {errors.phone ? <p className={errorClass}>{errors.phone}</p> : null}
      </div>

      <Button type="submit" disabled={submitting} className="mt-2 w-full">
        {submitting ? "Validating..." : "Continue"}
      </Button>
    </form>
  );
}
