"use client";

import { useState } from "react";
import Link from "next/link";
import AuthHeader from "@/components/auth/AuthHeader";
import ErrorBanner from "@/components/auth/ErrorBanner";
import SuccessBanner from "@/components/auth/SuccessBanner";
import LoginStep, { type LoginDraft } from "@/components/auth/LoginStep";
import ForgotPasswordStep from "@/components/auth/ForgotPasswordStep";
import ResetOtpStep from "@/components/auth/ResetOtpStep";
import IdentifierStep, {
  type IdentifierDraft,
  type IdentifierResult,
} from "@/components/register/steps/IdentifierStep";
import PasswordStep, { type PasswordDraft } from "@/components/register/steps/PasswordStep";
import OtpStep from "@/components/register/steps/OtpStep";
import type { PersonaConfig } from "@/lib/personas";
import { maskEmail } from "@/lib/format";
import {
  cognitoConfirmForgotPassword,
  cognitoConfirmSignUp,
  cognitoForgotPassword,
  cognitoLogin,
  cognitoSignUp,
  describeCognitoError,
  ensureProfileNotRegistered,
  logCognitoSessionTokens,
  ProfileAlreadyExistsError,
  validateWithRMA,
} from "@/lib/registrationService";

type RegisterFlowProps = {
  persona: PersonaConfig;
};

type Mode = "login" | "signup";
type Step =
  | "login"
  | "identifier"
  | "password"
  | "otp"
  | "forgot-email"
  | "forgot-otp"
  | "forgot-password";

export default function RegisterFlow({ persona }: RegisterFlowProps) {
  const [mode, setMode] = useState<Mode>("signup");
  const [step, setStep] = useState<Step>("identifier");
  const [identifier, setIdentifier] = useState<IdentifierResult | null>(null);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);

  // In-progress field values for each step, kept alive here so navigating
  // back and forth between steps doesn't lose what was typed (each step
  // component unmounts on step change, which would otherwise reset its own
  // local state). Lost on a page reload, same as everything else here.
  const [identifierDraft, setIdentifierDraft] = useState<IdentifierDraft>();
  const [loginDraft, setLoginDraft] = useState<LoginDraft>();
  const [passwordDraft, setPasswordDraft] = useState<PasswordDraft>();
  const [resetPasswordDraft, setResetPasswordDraft] = useState<PasswordDraft>();
  const [forgotEmailDraft, setForgotEmailDraft] = useState("");

  function handleSwitchMode() {
    const nextMode = mode === "signup" ? "login" : "signup";
    setMode(nextMode);
    setStep(nextMode === "signup" ? "identifier" : "login");
    setError(null);
    setLoginSuccess(null);
  }

  async function handleLoginSubmit(loginIdentifier: string, password: string) {
    setSubmitting(true);
    setError(null);
    try {
      const { isSignedIn } = await cognitoLogin({
        persona: persona.slug,
        identifier: loginIdentifier,
        password,
      });
      if (isSignedIn) {
        window.location.href = persona.destination;
      } else {
        setError("Additional verification is required to finish logging in.");
        setSubmitting(false);
      }
    } catch (err) {
      setError(describeCognitoError(err, "We couldn't log you in with those details. Please try again."));
      setSubmitting(false);
    }
  }

  async function handleIdentifierSubmit(result: IdentifierResult) {
    setSubmitting(true);
    setError(null);
    try {
      await validateWithRMA(persona.slug, result);
      await ensureProfileNotRegistered(persona.slug, result);
      setIdentifier(result);
      setStep("password");
    } catch (err) {
      if (err instanceof ProfileAlreadyExistsError) {
        setError(err.message);
      } else {
        setError("We couldn't validate those details. Please try again.");
      }
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
        email: identifier.email,
        phone: identifier.phone,
        idValue: identifier.idValue,
        password: nextPassword,
      });
      setStep("otp");
    } catch (err) {
      setError(describeCognitoError(err, "Registration failed. Please try again."));
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
      await logCognitoSessionTokens();
      // Full navigation on purpose - the destination is a separate app
      // reached through the proxy rewrite, same convention as the broker
      // links.
      window.location.href = persona.destination;
    } catch (err) {
      setError(describeCognitoError(err, "That code didn't work. Please try again."));
      setSubmitting(false);
    }
  }

  function handleForgotPassword() {
    setError(null);
    setStep("forgot-email");
  }

  async function handleForgotEmailSubmit(email: string) {
    setSubmitting(true);
    setError(null);
    try {
      await cognitoForgotPassword({ persona: persona.slug, email });
      setResetEmail(email);
      setStep("forgot-otp");
    } catch (err) {
      setError(describeCognitoError(err, "We couldn't send a code to that address. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResendResetCode() {
    if (!resetEmail) return;
    try {
      await cognitoForgotPassword({ persona: persona.slug, email: resetEmail });
    } catch (err) {
      setError(describeCognitoError(err, "We couldn't resend the code. Please try again."));
    }
  }

  function handleForgotOtpSubmit(otp: string) {
    setResetOtp(otp);
    setError(null);
    setStep("forgot-password");
  }

  async function handleSetNewPasswordSubmit(newPassword: string) {
    if (!resetEmail) return;
    setSubmitting(true);
    setError(null);
    try {
      await cognitoConfirmForgotPassword({
        persona: persona.slug,
        email: resetEmail,
        otp: resetOtp,
        newPassword,
      });
      setLoginSuccess("Your password has been reset. Please log in with your new password.");
      setStep("login");
    } catch (err) {
      setError(describeCognitoError(err, "We couldn't reset your password. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  function handleBack() {
    setError(null);
    if (step === "password") setStep("identifier");
    else if (step === "otp") setStep("password");
    else if (step === "forgot-email") {
      setLoginSuccess(null);
      setStep("login");
    } else if (step === "forgot-otp") setStep("forgot-email");
    else if (step === "forgot-password") setStep("forgot-otp");
  }

  const signupStepLabel: Partial<Record<Step, string>> = {
    identifier: "Step 1/3",
    password: "Step 2/3",
    otp: "Step 3/3",
  };

  const headerByStep: Record<
    Step,
    { title: string; subtitle: string; backLabel?: string; divider?: boolean }
  > = {
    login: {
      title: `Log in as ${persona.label}`,
      subtitle: "Enter your details to log in.",
    },
    identifier: {
      title: `Your Demographics`,
      subtitle: "Fill the below details",
      divider: true,
    },
    password: {
      title: "Set Password",
      subtitle: "Set your password for logging in.",
      divider: true,
    },
    otp: {
      title: "OTP Verification",
      subtitle: `Enter the OTP we sent to ${identifier?.email ?? "your email"}.`,
      divider: true,
    },
    "forgot-email": {
      title: "Forgot Password",
      subtitle: "Enter your registered email address to get a verification code",
      backLabel: "Back to Login",
      divider: true,
    },
    "forgot-otp": {
      title: "OTP Verification",
      subtitle: `Enter the OTP we have shared on ${maskEmail(resetEmail)}!`,
      backLabel: "Back to Login",
      divider: true,
    },
    "forgot-password": {
      title: "Set New Password",
      subtitle: "Choose a new password for logging in.",
      backLabel: "Back to Login",
      divider: true,
    },
  };

  const showBack = step !== "login" && step !== "identifier";

  return (
    <div className="mx-auto flex w-full max-w-[440px] flex-col gap-6 rounded-2xl border border-[#E9E9E9] bg-white p-8 shadow-[0_12px_32px_rgba(19,83,123,0.08)]">
      {step === "login" || step === "identifier" ? (
        <p className="text-[12px] font-medium text-[#98A2B3]">
          {mode === "signup" ? "Signing up" : "Logging in"} as{" "}
          <span className="font-semibold text-[#13537B]">{persona.label}</span>
          {" · "}
          <Link href="/" className="underline hover:text-[#13537B]">
            not you?
          </Link>
        </p>
      ) : null}

      <AuthHeader
        title={headerByStep[step].title}
        subtitle={headerByStep[step].subtitle}
        onBack={showBack ? handleBack : undefined}
        backLabel={headerByStep[step].backLabel}
        stepLabel={signupStepLabel[step]}
        divider={headerByStep[step].divider}
      />

      {loginSuccess && step === "login" ? <SuccessBanner message={loginSuccess} /> : null}
      {error ? <ErrorBanner message={error} /> : null}

      {step === "login" ? (
        <LoginStep
          submitting={submitting}
          onSubmit={handleLoginSubmit}
          onForgotPassword={handleForgotPassword}
          draft={loginDraft}
          onDraftChange={setLoginDraft}
        />
      ) : null}

      {step === "identifier" ? (
        <IdentifierStep
          persona={persona}
          submitting={submitting}
          onSubmit={handleIdentifierSubmit}
          draft={identifierDraft}
          onDraftChange={setIdentifierDraft}
        />
      ) : null}

      {step === "password" ? (
        <PasswordStep
          submitting={submitting}
          onSubmit={handlePasswordSubmit}
          draft={passwordDraft}
          onDraftChange={setPasswordDraft}
        />
      ) : null}

      {step === "otp" ? (
        <OtpStep
          identifierValue={identifier?.email ?? ""}
          submitting={submitting}
          onSubmit={handleOtpSubmit}
        />
      ) : null}

      {step === "forgot-email" ? (
        <ForgotPasswordStep
          submitting={submitting}
          onSubmit={handleForgotEmailSubmit}
          draft={forgotEmailDraft}
          onDraftChange={setForgotEmailDraft}
        />
      ) : null}

      {step === "forgot-otp" ? (
        <ResetOtpStep
          submitting={submitting}
          onSubmit={handleForgotOtpSubmit}
          onResend={handleResendResetCode}
        />
      ) : null}

      {step === "forgot-password" ? (
        <PasswordStep
          submitting={submitting}
          onSubmit={handleSetNewPasswordSubmit}
          submitLabel="Reset Password"
          submittingLabel="Resetting..."
          draft={resetPasswordDraft}
          onDraftChange={setResetPasswordDraft}
        />
      ) : null}

      {step === "login" || step === "identifier" ? (
        <p className="text-center text-[13px] text-[#667085]">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={handleSwitchMode}
                className="cursor-pointer font-semibold text-[#13537B] underline hover:opacity-70"
              >
                Log in
              </button>
            </>
          ) : (
            <>
              New here?{" "}
              <button
                type="button"
                onClick={handleSwitchMode}
                className="cursor-pointer font-semibold text-[#13537B] underline hover:opacity-70"
              >
                Sign up
              </button>
            </>
          )}
        </p>
      ) : null}
    </div>
  );
}
