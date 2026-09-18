"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import OtpDigitsInput from "@/components/register/OtpDigitsInput";
import { useCountdown } from "@/components/register/useCountdown";
import { errorClass, labelClass } from "@/components/register/formStyles";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 59;

type ResetOtpStepProps = {
  submitting: boolean;
  onSubmit: (otp: string) => void;
  onResend?: () => void;
};

export default function ResetOtpStep({ submitting, onSubmit, onResend }: ResetOtpStepProps) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resendKey, setResendKey] = useState(0);
  const { secondsLeft, reset } = useCountdown(RESEND_SECONDS);

  function handleResend() {
    reset();
    setOtp("");
    setError(null);
    setResendKey((prev) => prev + 1);
    onResend?.();
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (otp.length !== OTP_LENGTH) {
      setError(`Enter the ${OTP_LENGTH}-digit code.`);
      return;
    }

    setError(null);
    onSubmit(otp);
  }

  const resendLabel =
    secondsLeft > 0
      ? `Resend OTP : 00:${secondsLeft.toString().padStart(2, "0")}`
      : "Resend OTP";

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Enter OTP</label>
        <OtpDigitsInput key={resendKey} length={OTP_LENGTH} onChange={setOtp} />
        {error ? <p className={errorClass}>{error}</p> : null}
      </div>

      <button
        type="button"
        onClick={handleResend}
        disabled={secondsLeft > 0}
        className="w-fit cursor-pointer text-[12px] font-semibold text-[#13537B] transition enabled:hover:opacity-70 disabled:cursor-not-allowed disabled:text-[#98A2B3]"
      >
        {resendLabel}
      </button>

      <Button type="submit" disabled={submitting} className="mt-auto w-full">
        {submitting ? "Verifying..." : "Verify Code"}
      </Button>
    </form>
  );
}
