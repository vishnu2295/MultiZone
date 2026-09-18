"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { errorClass, inputClass, labelClass } from "@/components/register/formStyles";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ForgotPasswordStepProps = {
  submitting: boolean;
  onSubmit: (email: string) => void;
  draft?: string;
  onDraftChange?: (email: string) => void;
};

export default function ForgotPasswordStep({
  submitting,
  onSubmit,
  draft = "",
  onDraftChange,
}: ForgotPasswordStepProps) {
  const [email, setEmail] = useState(draft);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setError("Enter a valid email address.");
      return;
    }

    setError(null);
    onSubmit(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="forgotEmail" className={labelClass}>
          Email
        </label>
        <input
          id="forgotEmail"
          name="forgotEmail"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            onDraftChange?.(event.target.value);
          }}
          placeholder="Enter your email address"
          className={inputClass}
          autoComplete="email"
        />
        {error ? <p className={errorClass}>{error}</p> : null}
      </div>

      <Button type="submit" disabled={submitting} className="mt-auto w-full">
        {submitting ? "Sending..." : "Get Verification Code"}
      </Button>
    </form>
  );
}
