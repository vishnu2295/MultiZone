"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { errorClass, inputClass, labelClass } from "@/components/register/formStyles";

const MIN_LENGTH = 8;

type PasswordStepProps = {
  submitting: boolean;
  onSubmit: (password: string) => void;
};

export default function PasswordStep({ submitting, onSubmit }: PasswordStepProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className={labelClass}>
          Create Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter a password"
          className={inputClass}
          autoComplete="new-password"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="confirmPassword" className={labelClass}>
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Re-enter your password"
          className={inputClass}
          autoComplete="new-password"
        />
      </div>

      {error ? <p className={errorClass}>{error}</p> : null}

      <Button type="submit" disabled={submitting} className="mt-2 w-full">
        {submitting ? "Registering..." : "Register"}
      </Button>
    </form>
  );
}
