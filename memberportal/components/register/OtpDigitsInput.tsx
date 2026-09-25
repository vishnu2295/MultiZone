"use client";

import { useRef, useState } from "react";

type OtpDigitsInputProps = {
  length?: number;
  onChange: (value: string) => void;
};

// Pass a changing `key` from the parent (e.g. bumped on resend) to clear the
// boxes - the component owns its digit state internally, so a remount is the
// simplest way to reset it from outside.
export default function OtpDigitsInput({ length = 6, onChange }: OtpDigitsInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  function commit(next: string[]) {
    setDigits(next);
    onChange(next.join(""));
  }

  function updateDigit(index: number, rawValue: string) {
    const value = rawValue.replace(/\D/g, "");
    const next = [...digits];

    if (value.length > 1) {
      // Handles pasted codes.
      value
        .split("")
        .slice(0, length - index)
        .forEach((char, offset) => {
          next[index + offset] = char;
        });
      const lastFilled = Math.min(index + value.length, length) - 1;
      inputRefs.current[lastFilled]?.focus();
    } else {
      next[index] = value;
      if (value && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }

    commit(next);
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  return (
    <div className="flex justify-between gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={length}
          value={digit}
          placeholder="0"
          onChange={(event) => updateDigit(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          className="h-12 w-full max-w-13 rounded-lg border border-[#E9E9E9] bg-white text-center text-lg font-semibold text-[#13537B] outline-none transition placeholder:text-[#98A2B3]/50 focus:border-[#00BBE6] focus:ring-2 focus:ring-[#00bbe6]/20"
        />
      ))}
    </div>
  );
}
