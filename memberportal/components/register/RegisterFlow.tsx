"use client";

import { useState } from "react";
import Link from "next/link";
import Stepper from "@/components/register/Stepper";
import IdentifierStep, {
  type IdentifierResult,
} from "@/components/register/steps/IdentifierStep";
import PasswordStep from "@/components/register/steps/PasswordStep";
import OtpStep from "@/components/register/steps/OtpStep";
import { errorClass } from "@/components/register/formStyles";
import type { PersonaConfig } from "@/lib/personas";
import {
  cognitoConfirmSignUp,
  cognitoSignUp,
  validateWithRMA,
} from "@/lib/registrationService";

type RegisterFlowProps = {
  persona: PersonaConfig;
};

export default function RegisterFlow({ persona }: RegisterFlowProps) {
  const [step, setStep] = useState(2);
  const [identifier, setIdentifier] = useState<IdentifierResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleIdentifierSubmit(result: IdentifierResult) {
    setSubmitting(true);
    setError(null);
    try {
      await validateWithRMA(persona.slug, result);
      setIdentifier(result);
      setStep(3);
    } catch {
      setError("We couldn't validate those details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePasswordSubmit(nextPassword: string) {
    if (!identifier) return;
    setSubmitting(true);
    setError(null);
    try {
      await cognitoSignUp({
        persona: persona.slug,
        identifier: identifier.email,
        password: nextPassword,
      });
      setStep(4);
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleOtpSubmit(otp: string) {
    if (!identifier) return;
    setSubmitting(true);
    setError(null);
    try {
      await cognitoConfirmSignUp({
        persona: persona.slug,
        identifier: identifier.email,
        otp,
      });
      // Full navigation on purpose - the destination is a separate app
      // reached through the proxy rewrite, same convention as the Auth0
      // and broker links in LoginMenu.
      window.location.href = persona.destination;
    } catch {
      setError("That code didn't work. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[440px] flex-col gap-8 rounded-2xl border border-[#E9E9E9] bg-white p-8 shadow-[0_12px_32px_rgba(19,83,123,0.08)]">
      <Stepper currentStep={step} />

      <div className="flex flex-col gap-1">
        <p className="text-[12px] font-medium text-[#98A2B3]">
          Registering as{" "}
          <span className="font-semibold text-[#13537B]">{persona.label}</span>
          {" · "}
          <Link href="/" className="underline hover:text-[#13537B]">
            not you?
          </Link>
        </p>
        <h1 className="text-lg font-semibold text-[#13537B]">
          {step === 2 && "Verify your details"}
          {step === 3 && "Create your password"}
          {step === 4 && "Verify your email"}
        </h1>
      </div>

      {error ? <p className={errorClass}>{error}</p> : null}

      {step === 2 ? (
        <IdentifierStep
          persona={persona}
          submitting={submitting}
          onSubmit={handleIdentifierSubmit}
        />
      ) : null}

      {step === 3 ? (
        <PasswordStep submitting={submitting} onSubmit={handlePasswordSubmit} />
      ) : null}

      {step === 4 ? (
        <OtpStep
          identifierValue={identifier?.email ?? ""}
          submitting={submitting}
          onSubmit={handleOtpSubmit}
        />
      ) : null}
    </div>
  );
}
