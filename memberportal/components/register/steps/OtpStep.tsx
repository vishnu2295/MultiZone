"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { errorClass, labelClass } from "@/components/register/formStyles";

const OTP_LENGTH = 6;

type OtpStepProps = {
  identifierValue: string;
  submitting: boolean;
  onSubmit: (otp: string) => void;
};

export default function OtpStep({ identifierValue, submitting, onSubmit }: OtpStepProps) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (otp.length !== OTP_LENGTH) {
      setError(`Enter the ${OTP_LENGTH}-digit code.`);
      return;
    }

    setError(null);
    onSubmit(otp);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="otp" className={labelClass}>
          Email OTP
        </label>
        <p className="text-[12px] text-[#98A2B3]">
          We sent a {OTP_LENGTH}-digit code to {identifierValue || "your email"}.
        </p>
        <input
          id="otp"
          name="otp"
          type="text"
          inputMode="numeric"
          maxLength={OTP_LENGTH}
          value={otp}
          onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
          placeholder="000000"
          className="w-full rounded-lg border border-[#E9E9E9] bg-white px-4 py-3 text-center text-lg font-semibold tracking-[0.6em] text-[#13537B] outline-none transition placeholder:tracking-normal placeholder:text-[#98A2B3] focus:border-[#00BBE6] focus:ring-2 focus:ring-[#00bbe6]/20"
        />
        {error ? <p className={errorClass}>{error}</p> : null}
      </div>

      <Button type="submit" disabled={submitting} className="mt-2 w-full">
        {submitting ? "Verifying..." : "Verify"}
      </Button>
    </form>
  );
}
