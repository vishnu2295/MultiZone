"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import PasswordInput from "@/components/register/PasswordInput";
import {
  errorClass,
  inputClass,
  labelClass,
} from "@/components/register/formStyles";

export type LoginDraft = {
  identifier: string;
  password: string;
};

const EMPTY_DRAFT: LoginDraft = { identifier: "", password: "" };

type LoginStepProps = {
  submitting: boolean;
  onSubmit: (identifier: string, password: string) => void;
  onForgotPassword: () => void;
  draft?: LoginDraft;
  onDraftChange?: (draft: LoginDraft) => void;
};

export default function LoginStep({
  submitting,
  onSubmit,
  onForgotPassword,
  draft,
  onDraftChange,
}: LoginStepProps) {
  const initial = draft ?? EMPTY_DRAFT;
  const [identifier, setIdentifier] = useState(initial.identifier);
  const [password, setPassword] = useState(initial.password);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!identifier.trim() || !password) {
      setError("Enter your details to log in.");
      return;
    }

    setError(null);
    onSubmit(identifier.trim(), password);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="loginIdentifier" className={labelClass}>
          Email
        </label>
        <input
          id="loginIdentifier"
          name="loginIdentifier"
          type="text"
          value={identifier}
          onChange={(event) => {
            setIdentifier(event.target.value);
            onDraftChange?.({ identifier: event.target.value, password });
          }}
          placeholder="Enter your details"
          className={inputClass}
          autoComplete="username"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="loginPassword" className={labelClass}>
            Password
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="cursor-pointer text-[12px] font-medium text-[#98A2B3] underline hover:text-[#13537B]"
          >
            Forgot password?
          </button>
        </div>
        <PasswordInput
          id="loginPassword"
          name="loginPassword"
          value={password}
          onChange={setPassword}
          placeholder="Enter your password"
          autoComplete="current-password"
        />
      </div>

      {error ? <p className={errorClass}>{error}</p> : null}

      <Button type="submit" disabled={submitting} className="mt-auto w-full">
        {submitting ? "Logging in..." : "Log In"}
      </Button>
    </form>
  );
}
