"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import PasswordInput from "@/components/register/PasswordInput";
import { errorClass, labelClass } from "@/components/register/formStyles";

const MIN_LENGTH = 8;

export type PasswordDraft = {
  password: string;
  confirmPassword: string;
};

const EMPTY_DRAFT: PasswordDraft = { password: "", confirmPassword: "" };

type PasswordStepProps = {
  submitting: boolean;
  onSubmit: (password: string) => void;
  submitLabel?: string;
  submittingLabel?: string;
  draft?: PasswordDraft;
  onDraftChange?: (draft: PasswordDraft) => void;
};

export default function PasswordStep({
  submitting,
  onSubmit,
  submitLabel = "Register",
  submittingLabel = "Registering...",
  draft,
  onDraftChange,
}: PasswordStepProps) {
  const initial = draft ?? EMPTY_DRAFT;
  const [password, setPassword] = useState(initial.password);
  const [confirmPassword, setConfirmPassword] = useState(initial.confirmPassword);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (password.length < MIN_LENGTH) {
      setError(`Password must be at least ${MIN_LENGTH} characters.`);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    onSubmit(password);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className={labelClass}>
          Set Password
        </label>
        <PasswordInput
          id="password"
          name="password"
          value={password}
          onChange={(next) => {
            setPassword(next);
            onDraftChange?.({ password: next, confirmPassword });
          }}
          placeholder="Enter your password"
          autoComplete="new-password"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="confirmPassword" className={labelClass}>
          Confirm Password
        </label>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(next) => {
            setConfirmPassword(next);
            onDraftChange?.({ password, confirmPassword: next });
          }}
          placeholder="Re-enter your password"
          autoComplete="new-password"
        />
      </div>

      {error ? <p className={errorClass}>{error}</p> : null}

      <Button type="submit" disabled={submitting} className="mt-auto w-full">
        {submitting ? submittingLabel : submitLabel}
      </Button>
    </form>
  );
}
