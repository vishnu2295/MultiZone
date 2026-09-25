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
  cognitoConfirmSignInWithCode,
  cognitoConfirmSignUp,
  cognitoForgotPassword,
  cognitoLogin,
  cognitoResendSignUpCode,
  cognitoSelectMfaType,
  cognitoSignUp,
  describeCognitoError,
  ensureProfileNotRegistered,
  logCognitoSessionTokens,
  ProfileAlreadyExistsError,
  registerCognitoProfile,
  validateWithRMA,
} from "@/lib/registrationService";

type Mode = "login" | "signup";
type MfaChannel = "sms" | "email";
type SignInNextStep = Awaited<ReturnType<typeof cognitoLogin>>["nextStep"];
type Step =
  | "welcome"
  | "login"
  | "identifier"
  | "password"
  | "otp"
  | "mfa-otp"
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
  // Where Cognito says it sent the reset code (masked email or phone).
  const [resetDestination, setResetDestination] = useState("");
  const [pendingLoginCreds, setPendingLoginCreds] = useState<{
    identifier: string;
    password: string;
  } | null>(null);
  const [mfaChannel, setMfaChannel] = useState<MfaChannel>("sms");
  const [mfaDestination, setMfaDestination] = useState("");
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
      setResetDestination("");
      setPendingLoginCreds(null);
      setMfaDestination("");
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
    // Switching persona (e.g. Employee -> Employer) starts the forms over -
    // what was typed for one persona (ID vs member number, etc.) doesn't
    // carry over. Re-picking the same persona keeps the drafts.
    if (persona && persona.slug !== nextPersona.slug) {
      setIdentifier(null);
      setResetEmail("");
      setResetOtp("");
      setResetDestination("");
      setPendingLoginCreds(null);
      setMfaDestination("");
      setIdentifierDraft(undefined);
      setLoginDraft(undefined);
      setPasswordDraft(undefined);
      setResetPasswordDraft(undefined);
      setForgotEmailDraft("");
    }
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

  // Closes the modal and lands on "/" - proxy.ts then forwards the member to
  // their role's zone (rma_roles claim: Organization -> /company, Individual
  // -> /claimant). Full navigation on purpose: the zones are separate apps
  // reached through the proxy rewrite, and the proxy needs the fresh session
  // cookies on the request.
  function goToRoleHome() {
    onClose();
    window.location.href = "/";
  }

  // Shows the OTP screen for the MFA challenge Cognito returned after the
  // password. Returns false for sign-in steps this modal doesn't handle.
  async function showMfaStep(nextStep: SignInNextStep): Promise<boolean> {
    switch (nextStep.signInStep) {
      case "CONFIRM_SIGN_IN_WITH_SMS_CODE":
      case "CONFIRM_SIGN_IN_WITH_EMAIL_CODE":
        setMfaChannel(
          nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_EMAIL_CODE" ? "email" : "sms",
        );
        setMfaDestination(nextStep.codeDeliveryDetails?.destination ?? "");
        setStep("mfa-otp");
        return true;
      case "CONTINUE_SIGN_IN_WITH_MFA_SELECTION": {
        // User has both SMS and email MFA enabled - prefer email.
        const allowed = nextStep.allowedMFATypes ?? [];
        const preferred = allowed.includes("EMAIL")
          ? "EMAIL"
          : allowed.includes("SMS")
            ? "SMS"
            : undefined;
        if (!preferred) return false;
        const { nextStep: afterSelection } = await cognitoSelectMfaType(preferred);
        return showMfaStep(afterSelection);
      }
      default:
        return false;
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
        await logCognitoSessionTokens();
        goToRoleHome();
      } else if (await showMfaStep(nextStep)) {
        setPendingLoginCreds({ identifier: loginIdentifier, password });
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

  async function handleMfaOtpSubmit(otp: string) {
    if (!persona) return;
    setSubmitting(true);
    setError(null);
    try {
      const { isSignedIn } = await cognitoConfirmSignInWithCode(otp);
      if (isSignedIn) {
        await logCognitoSessionTokens();
        goToRoleHome();
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

  async function handleResendMfaOtp() {
    if (!persona || !pendingLoginCreds) return;
    try {
      const { nextStep } = await cognitoLogin({
        persona: persona.slug,
        identifier: pendingLoginCreds.identifier,
        password: pendingLoginCreds.password,
      });
      await showMfaStep(nextStep);
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
        idValue: identifier.idValue,
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
      const { autoSignInFailed } = await cognitoConfirmSignUp({
        persona: persona.slug,
        identifier: identifier.email,
        otp,
      });

      if (autoSignInFailed) {
        // The code was correct and the account is confirmed - there's just
        // no session yet. Send them to log in manually rather than showing
        // an error that would incorrectly imply the code was wrong.
        setLoginSuccess("Your account is confirmed. Please log in to continue.");
        setStep("login");
        setSubmitting(false);
        return;
      }

      await logCognitoSessionTokens();
      await registerCognitoProfile();
      goToRoleHome();
    } catch (err) {
      setError(
        describeCognitoError(err, "That code didn't work. Please try again."),
      );
      setSubmitting(false);
    }
  }

  async function handleResendOtp() {
    if (!identifier) return;
    try {
      await cognitoResendSignUpCode(identifier.email);
    } catch (err) {
      setError(
        describeCognitoError(err, "We couldn't resend the code. Please try again."),
      );
    }
  }

  function handleForgotPassword() {
    // Each forgot-password attempt starts clean - don't carry over the
    // code or new password typed during an earlier reset.
    setResetOtp("");
    setResetPasswordDraft(undefined);
    setError(null);
    setStep("forgot-email");
  }

  async function handleForgotEmailSubmit(email: string) {
    if (!persona) return;
    setSubmitting(true);
    setError(null);
    try {
      const { nextStep } = await cognitoForgotPassword({
        persona: persona.slug,
        email,
      });
      setResetEmail(email);
      setResetDestination(nextStep.codeDeliveryDetails?.destination ?? "");
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
      const { nextStep } = await cognitoForgotPassword({
        persona: persona.slug,
        email: resetEmail,
      });
      setResetDestination(nextStep.codeDeliveryDetails?.destination ?? "");
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
      setResetOtp("");
      setResetPasswordDraft(undefined);
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
      // Cognito only checks the reset code here, together with the new
      // password - there's no way to verify it on the OTP screen. Send the
      // user back there when it's the code that's wrong.
      const name = err instanceof Error ? err.name : undefined;
      if (name === "CodeMismatchException" || name === "ExpiredCodeException") {
        setResetOtp("");
        setStep("forgot-otp");
      }
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
    } else if (step === "mfa-otp") {
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
    "mfa-otp": {
      title: "OTP Verification",
      subtitle: mfaDestination
        ? `Enter the OTP we sent to ${mfaDestination}.`
        : `Enter the OTP we sent to your registered ${
            mfaChannel === "email" ? "email address" : "mobile number"
          }.`,
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
      subtitle: `Enter the OTP we have shared on ${
        resetDestination || maskEmail(resetEmail)
      }!`,
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
                onResend={handleResendOtp}
              />
            ) : null}

            {step === "mfa-otp" ? (
              <ResetOtpStep
                submitting={submitting}
                onSubmit={handleMfaOtpSubmit}
                onResend={handleResendMfaOtp}
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
