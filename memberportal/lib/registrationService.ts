import "@/lib/amplifyConfig";
import {
  autoSignIn,
  confirmResetPassword,
  confirmSignIn,
  confirmSignUp,
  fetchAuthSession,
  resetPassword,
  signIn,
  signUp,
} from "aws-amplify/auth";
import type { PersonaSlug } from "@/lib/personas";
import { decodeJwt } from "@/lib/jwt";

// Service layer for the custom Cognito registration flow. Everything except
// validateWithRMA calls real Cognito via Amplify Auth (see
// lib/amplifyConfig.ts for the User Pool config, sourced from
// NEXT_PUBLIC_COGNITO_*). validateWithRMA is still a stub - it hits RMA's own
// membership API, not Cognito - simulate a network call and always resolve;
// swap the body for a real call once it's available, the UI call site won't
// need to change.

const STUB_DELAY_MS = 600;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Base domain of the registration API, readable in the browser (see
// .env.local.example). Used to check whether a profile already exists
// before letting a signup proceed to the Password step.
const REGISTER_API_DOMAIN = process.env.NEXT_PUBLIC_REGISTER_API_DOMAIN ?? "";
const VALIDATE_PROFILE_URL = `${REGISTER_API_DOMAIN}/api/mobileApp/public/registration/validate/profile`;

// Maps our PersonaSlug onto the backend's PersonaType enum (Unknown | Person
// | Company | HealthCareProvider | Pensioner).
const PERSONA_TYPE_BY_SLUG: Record<PersonaSlug, "Person" | "Company"> = {
  employee: "Person",
  employer: "Company",
};

export class ProfileAlreadyExistsError extends Error {
  constructor() {
    super("An account with these details already exists. Please log in instead.");
    this.name = "ProfileAlreadyExistsError";
  }
}

// Maps a thrown Amplify/Cognito error to user-facing copy. Falls back to the
// caller's generic message for anything not called out here.
export function describeCognitoError(error: unknown, fallback: string): string {
  const name = error instanceof Error ? error.name : undefined;
  switch (name) {
    case "UsernameExistsException":
      return "An account with this email already exists.";
    case "InvalidPasswordException":
      return "That password doesn't meet the required strength.";
    case "InvalidParameterException":
      return "Enter a valid email and phone number (phone must include country code, e.g. +27...).";
    case "CodeMismatchException":
      return "That code didn't match. Please try again.";
    case "ExpiredCodeException":
      return "That code has expired. Request a new one.";
    case "LimitExceededException":
    case "TooManyRequestsException":
      return "Too many attempts. Please wait a moment and try again.";
    case "UserNotFoundException":
      return "We couldn't find an account with those details.";
    case "NotAuthorizedException":
      return "Incorrect email or password.";
    case "UserNotConfirmedException":
      return "This account hasn't been verified yet.";
    default:
      return fallback;
  }
}

export type IdentifierInput = {
  /** Employee's ID number, or the Employer's member number. */
  idValue: string;
  email: string;
  phone: string;
};

// TODO(API): replace with the real RMA validation endpoint.
export async function validateWithRMA(
  persona: PersonaSlug,
  identifier: IdentifierInput,
): Promise<{ success: true }> {
  console.log("[STUB] validateWithRMA", { persona, identifier });
  await delay(STUB_DELAY_MS);
  return { success: true };
}

type ValidateProfileResponse = {
  isAuth0Registered: boolean;
  isRmaRegistered: boolean;
  isSelectedPersona: boolean;
};

// Checks whether a profile already exists for these registration details.
// isRmaRegistered: true means a matching profile was found - throws
// ProfileAlreadyExistsError so callers can surface it like any other
// registration error. Any other response (including a non-2xx status) is
// treated as no existing profile, so it's safe to continue.
export async function ensureProfileNotRegistered(
  persona: PersonaSlug,
  identifier: IdentifierInput,
): Promise<void> {
  const response = await fetch(VALIDATE_PROFILE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: identifier.email,
      phoneNumber: identifier.phone || null,
      identifier: identifier.idValue,
      personaType: PERSONA_TYPE_BY_SLUG[persona],
    }),
  });

  if (!response.ok) return;

  const data: ValidateProfileResponse = await response.json();
  if (data.isRmaRegistered) {
    throw new ProfileAlreadyExistsError();
  }
}

export async function cognitoSignUp(input: {
  persona: PersonaSlug;
  email: string;
  phone: string;
  password: string;
}) {
  const { isSignUpComplete, nextStep } = await signUp({
    username: input.email,
    password: input.password,
    options: {
      userAttributes: {
        email: input.email,
        phone_number: input.phone,
      },
      // Lets confirmSignUp's nextStep be COMPLETE_AUTO_SIGN_IN, so we can
      // sign the user straight in below without asking for their password
      // again - otherwise Cognito confirms the account but never
      // establishes a session, and fetchAuthSession() stays empty.
      autoSignIn: true,
    },
  });
  return { isSignUpComplete, nextStep };
}

export async function cognitoConfirmSignUp(input: {
  persona: PersonaSlug;
  identifier: string;
  otp: string;
}) {
  const { isSignUpComplete, nextStep } = await confirmSignUp({
    username: input.identifier,
    confirmationCode: input.otp,
  });

  if (nextStep.signUpStep === "COMPLETE_AUTO_SIGN_IN") {
    await autoSignIn();
  }

  return { isSignUpComplete };
}

/**
 * Diagnostic helper: logs the decoded access/ID token claims for the current
 * Cognito session, if one exists. Amplify v6 has no public API to read the
 * raw refresh token out of fetchAuthSession() - it's kept internal to the
 * token provider and used automatically to refresh the other two tokens - so
 * a payload like the Auth0 flow's { accessToken, refreshToken } can't be
 * built the same way from Cognito; call this out if the Registration API
 * requires a refresh token.
 */
export async function logCognitoSessionTokens(): Promise<{
  accessToken?: string;
  idToken?: string;
}> {
  const { tokens } = await fetchAuthSession();
  const accessToken = tokens?.accessToken?.toString();
  const idToken = tokens?.idToken?.toString();

  if (!accessToken) {
    console.log("[Cognito] No active session - fetchAuthSession() returned no tokens.");
    return {};
  }

  console.log("[Cognito] Access token claims:", decodeJwt(accessToken));
  console.log("[Cognito] Raw access token:", accessToken);

  if (idToken) {
    console.log("[Cognito] ID token claims:", decodeJwt(idToken));
    console.log("[Cognito] Raw ID token:", idToken);
  }

  console.log(
    "[Cognito] No raw refresh token available - Amplify manages it internally, not exposed via fetchAuthSession().",
  );

  return { accessToken, idToken };
}

export async function cognitoLogin(input: {
  persona: PersonaSlug;
  identifier: string;
  password: string;
}) {
  const { isSignedIn, nextStep } = await signIn({
    username: input.identifier,
    password: input.password,
  });
  return { isSignedIn, nextStep };
}

export async function cognitoConfirmSignInWithSms(otp: string) {
  const { isSignedIn, nextStep } = await confirmSignIn({
    challengeResponse: otp,
  });
  return { isSignedIn, nextStep };
}

export async function cognitoForgotPassword(input: {
  persona: PersonaSlug;
  email: string;
}) {
  const output = await resetPassword({ username: input.email });
  return output;
}

export async function cognitoConfirmForgotPassword(input: {
  persona: PersonaSlug;
  email: string;
  otp: string;
  newPassword: string;
}): Promise<{ success: true }> {
  await confirmResetPassword({
    username: input.email,
    confirmationCode: input.otp,
    newPassword: input.newPassword,
  });
  return { success: true };
}
