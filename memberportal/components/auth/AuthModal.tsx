"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import AuthHeader from "@/components/auth/AuthHeader";
import WelcomeStep from "@/components/auth/WelcomeStep";
import LoginStep, { type LoginDraft } from "@/components/auth/LoginStep";
import ForgotPasswordStep from "@/components/auth/ForgotPasswordStep";
import ResetOtpStep from "@/components/auth/ResetOtpStep";
import ErrorBanner from "@/components/auth/ErrorBanner";
import SuccessBanner from "@/components/auth/SuccessBanner";
import IdentifierStep, {
  type IdentifierDraft,
  type IdentifierResult,
} from "@/components/register/steps/IdentifierStep";
import PasswordStep, {
  type PasswordDraft,
} from "@/components/register/steps/PasswordStep";
import OtpStep from "@/components/register/steps/OtpStep";
import type { PersonaConfig } from "@/lib/personas";
import { maskEmail } from "@/lib/format";
import {
  cognitoConfirmForgotPassword,
  cognitoConfirmSignInWithSms,
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

type Mode = "login" | "signup";
type Step =
  | "welcome"
  | "login"
  | "identifier"
  | "password"
  | "otp"
  | "sms-otp"
  | "forgot-email"
  | "forgot-otp"
  | "forgot-password";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
  initialMode?: Mode;
};

export default function AuthModal({
  open,
  onClose,
  initialMode = "signup",
}: AuthModalProps) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [step, setStep] = useState<Step>("welcome");
  const [persona, setPersona] = useState<PersonaConfig | null>(null);
  const [identifier, setIdentifier] = useState<IdentifierResult | null>(null);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [pendingLoginCreds, setPendingLoginCreds] = useState<{
    identifier: string;
    password: string;
  } | null>(null);
  const [smsOtpDestination, setSmsOtpDestination] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);
  const [wasOpen, setWasOpen] = useState(open);

  // In-progress field values for each step, kept alive here so navigating
  // back and forth between steps doesn't lose what was typed (each step
  // component unmounts on step change, which would otherwise reset its own
  // local state). Cleared below whenever the modal is reopened.
  const [identifierDraft, setIdentifierDraft] = useState<IdentifierDraft>();
  const [loginDraft, setLoginDraft] = useState<LoginDraft>();
  const [passwordDraft, setPasswordDraft] = useState<PasswordDraft>();
  const [resetPasswordDraft, setResetPasswordDraft] = useState<PasswordDraft>();
  const [forgotEmailDraft, setForgotEmailDraft] = useState("");

  // Re-initialize every time the modal opens, so a caller can reuse one
  // instance for both "Login" and "New Here? Sign Up" entry points. Reset
  // during render (React's documented pattern for state that depends on a
  // changing prop) rather than in an effect, to avoid an extra render pass.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setMode(initialMode);
      setStep("welcome");
      setPersona(null);
      setIdentifier(null);
      setResetEmail("");
      setResetOtp("");
      setPendingLoginCreds(null);
      setSmsOtpDestination("");
      setSubmitting(false);
      setError(null);
      setLoginSuccess(null);
      setIdentifierDraft(undefined);
      setLoginDraft(undefined);
      setPasswordDraft(undefined);
      setResetPasswordDraft(undefined);
      setForgotEmailDraft("");
    }
  }

  function handleClose() {
    onClose();
  }

  function handleSelectPersona(nextPersona: PersonaConfig) {
    setPersona(nextPersona);
    setError(null);
    setLoginSuccess(null);
    setStep(mode === "signup" ? "identifier" : "login");
  }

  function handleSwitchMode() {
    const nextMode = mode === "signup" ? "login" : "signup";
    setMode(nextMode);
    setError(null);
    setLoginSuccess(null);
    if (persona) {
      setStep(nextMode === "signup" ? "identifier" : "login");
    }
  }

  async function handleLoginSubmit(loginIdentifier: string, password: string) {
    if (!persona) return;
    setSubmitting(true);
    setError(null);
    try {
      const { isSignedIn, nextStep } = await cognitoLogin({
        persona: persona.slug,
        identifier: loginIdentifier,
        password,
      });
      if (isSignedIn) {
        window.location.href = persona.destination;
      } else if (nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_SMS_CODE") {
        setPendingLoginCreds({ identifier: loginIdentifier, password });
        setSmsOtpDestination(nextStep.codeDeliveryDetails?.destination ?? "");
        setStep("sms-otp");
        setSubmitting(false);
      } else {
        setError("Additional verification is required to finish logging in.");
        setSubmitting(false);
      }
    } catch (err) {
      setError(
        describeCognitoError(
          err,
          "We couldn't log you in with those details. Please try again.",
        ),
      );
      setSubmitting(false);
    }
  }

  async function handleSmsOtpSubmit(otp: string) {
    if (!persona) return;
    setSubmitting(true);
    setError(null);
    try {
      const { isSignedIn } = await cognitoConfirmSignInWithSms(otp);
      if (isSignedIn) {
        window.location.href = persona.destination;
      } else {
        setError("Additional verification is required to finish logging in.");
        setSubmitting(false);
      }
    } catch (err) {
      setError(
        describeCognitoError(err, "That code didn't work. Please try again."),
      );
      setSubmitting(false);
    }
  }

  async function handleResendSmsOtp() {
    if (!persona || !pendingLoginCreds) return;
    try {
      const { nextStep } = await cognitoLogin({
        persona: persona.slug,
        identifier: pendingLoginCreds.identifier,
        password: pendingLoginCreds.password,
      });
      if (nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_SMS_CODE") {
        setSmsOtpDestination(nextStep.codeDeliveryDetails?.destination ?? "");
      }
    } catch (err) {
      setError(
        describeCognitoError(
          err,
          "We couldn't resend the code. Please try again.",
        ),
      );
    }
  }

  async function handleIdentifierSubmit(result: IdentifierResult) {
    if (!persona) return;
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
    if (!persona || !identifier) return;
    setSubmitting(true);
    setError(null);
    try {
      await cognitoSignUp({
        persona: persona.slug,
        email: identifier.email,
        phone: identifier.phone,
        password: nextPassword,
      });
      setStep("otp");
    } catch (err) {
      setError(
        describeCognitoError(err, "Registration failed. Please try again."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleOtpSubmit(otp: string) {
    if (!persona || !identifier) return;
    setSubmitting(true);
    setError(null);
    try {
      await cognitoConfirmSignUp({
        persona: persona.slug,
        identifier: identifier.email,
        otp,
      });
      await logCognitoSessionTokens();
      window.location.href = persona.destination;
    } catch (err) {
      setError(
        describeCognitoError(err, "That code didn't work. Please try again."),
      );
      setSubmitting(false);
    }
  }

  function handleForgotPassword() {
    setError(null);
    setStep("forgot-email");
  }

  async function handleForgotEmailSubmit(email: string) {
    if (!persona) return;
    setSubmitting(true);
    setError(null);
    try {
      await cognitoForgotPassword({ persona: persona.slug, email });
      setResetEmail(email);
      setStep("forgot-otp");
    } catch (err) {
      setError(
        describeCognitoError(
          err,
          "We couldn't send a code to that address. Please try again.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResendResetCode() {
    if (!persona || !resetEmail) return;
    try {
      await cognitoForgotPassword({ persona: persona.slug, email: resetEmail });
    } catch (err) {
      setError(
        describeCognitoError(
          err,
          "We couldn't resend the code. Please try again.",
        ),
      );
    }
  }

  function handleForgotOtpSubmit(otp: string) {
    setResetOtp(otp);
    setError(null);
    setStep("forgot-password");
  }

  async function handleSetNewPasswordSubmit(newPassword: string) {
    if (!persona || !resetEmail) return;
    setSubmitting(true);
    setError(null);
    try {
      await cognitoConfirmForgotPassword({
        persona: persona.slug,
        email: resetEmail,
        otp: resetOtp,
        newPassword,
      });
      setLoginSuccess(
        "Your password has been reset. Please log in with your new password.",
      );
      setStep("login");
    } catch (err) {
      setError(
        describeCognitoError(
          err,
          "We couldn't reset your password. Please try again.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleBack() {
    setError(null);
    if (step === "login" || step === "identifier") {
      // Keep `persona` set (rather than clearing it) so WelcomeStep can
      // preselect it if the user comes back here.
      setStep("welcome");
    } else if (step === "password") {
      setStep("identifier");
    } else if (step === "otp") {
      setStep("password");
    } else if (step === "sms-otp") {
      setPendingLoginCreds(null);
      setStep("login");
    } else if (step === "forgot-email") {
      setLoginSuccess(null);
      setStep("login");
    } else if (step === "forgot-otp") {
      setStep("forgot-email");
    } else if (step === "forgot-password") {
      setStep("forgot-otp");
    }
  }

  const signupStepLabel: Partial<Record<Step, string>> = {
    identifier: "Step 1/3",
    password: "Step 2/3",
    otp: "Step 3/3",
  };

  const headerByStep: Record<
    Exclude<Step, "welcome">,
    { title: string; subtitle: string; backLabel?: string; divider?: boolean }
  > = {
    login: {
      title: `Log in as ${persona?.label ?? ""}`,
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
    "sms-otp": {
      title: "OTP Verification",
      subtitle: smsOtpDestination
        ? `Enter the OTP we sent to ${smsOtpDestination}.`
        : "Enter the OTP we sent to your registered mobile number.",
      backLabel: "Back to Login",
      divider: true,
    },
    "forgot-email": {
      title: "Forgot Password",
      subtitle:
        "Enter your registered email address to get a verification code",
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

  return (
    <Modal open={open} onClose={handleClose} labelledBy="auth-modal-title">
      <div className="flex h-[500px] max-h-[85vh] flex-col gap-6 overflow-y-auto rounded-2xl border border-[#E9E9E9] bg-white p-8 shadow-[0_24px_60px_rgba(1,22,30,0.25)]">
        {step === "welcome" ? (
          <WelcomeStep
            mode={mode}
            onSelectPersona={handleSelectPersona}
            onSwitchMode={handleSwitchMode}
            initialPersona={persona}
          />
        ) : (
          <>
            <AuthHeader
              title={headerByStep[step].title}
              subtitle={headerByStep[step].subtitle}
              onBack={handleBack}
              backLabel={headerByStep[step].backLabel}
              stepLabel={signupStepLabel[step]}
              divider={headerByStep[step].divider}
            />

            {loginSuccess && step === "login" ? (
              <SuccessBanner message={loginSuccess} />
            ) : null}
            {error ? <ErrorBanner message={error} /> : null}

            {step === "login" && persona ? (
              <LoginStep
                submitting={submitting}
                onSubmit={handleLoginSubmit}
                onForgotPassword={handleForgotPassword}
                draft={loginDraft}
                onDraftChange={setLoginDraft}
              />
            ) : null}

            {step === "identifier" && persona ? (
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

            {step === "sms-otp" ? (
              <ResetOtpStep
                submitting={submitting}
                onSubmit={handleSmsOtpSubmit}
                onResend={handleResendSmsOtp}
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
          </>
        )}
      </div>
    </Modal>
  );
}
