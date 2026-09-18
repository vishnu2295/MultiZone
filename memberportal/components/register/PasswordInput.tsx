"use client";

import { useState } from "react";
import { inputClass } from "@/components/register/formStyles";

type PasswordInputProps = {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete: string;
};

export default function PasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder,
  autoComplete,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`${inputClass} pr-11`}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#98A2B3] transition hover:text-[#13537B]"
      >
        {visible ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5" aria-hidden="true">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5" aria-hidden="true">
            <path d="M3 3l18 18" />
            <path d="M10.58 10.58a2 2 0 002.83 2.83" />
            <path d="M9.88 5.09A9.77 9.77 0 0112 5c6.5 0 10 7 10 7a17.6 17.6 0 01-3.06 3.94M6.61 6.61A17.7 17.7 0 002 12s3.5 7 10 7a9.7 9.7 0 004.39-1.02" />
          </svg>
        )}
      </button>
    </div>
  );
}
