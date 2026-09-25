import "@/lib/amplifyConfig";
import {
  autoSignIn,
  confirmResetPassword,
  confirmSignIn,
  confirmSignUp,
  fetchAuthSession,
  resendSignUpCode,
  resetPassword,
  signIn,
  signOut,
  signUp,
} from "aws-amplify/auth";
import type { PersonaSlug } from "@/lib/personas";
import { decodeJwt } from "@/lib/jwt";
import { getRoleHomePath, getRolesFromAccessToken } from "@/lib/roles";

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
const REGISTER_PROFILE_URL = `${REGISTER_API_DOMAIN}/api/mobileApp/public/registration/v2/register`;

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
      // ForgotPassword raises this when the user has no verified email/phone
      // to deliver the code to (e.g. the account was never confirmed).
      if (error instanceof Error && /no registered\/verified email or phone_number/i.test(error.message)) {
        return "This account hasn't been verified yet, so we can't send a reset code. Please complete sign-up verification first.";
      }
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
  /** Employer's member number, or the Employee's ID/passport number. */
  idValue: string;
  password: string;
}) {
  const { isSignUpComplete, nextStep } = await signUp({
    username: input.email,
    password: input.password,
    options: {
      userAttributes: {
        email: input.email,
        phone_number: input.phone,
        "custom:identifier": input.idValue,
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
}): Promise<{ isSignUpComplete: boolean; autoSignInFailed: boolean }> {
  // confirmSignUp succeeding means the code was correct and the account is
  // now confirmed - that's already true by the time we get here. autoSignIn
  // is a separate, subsequent call to establish a session for the
  // now-confirmed user; if it throws, the account is still confirmed, so we
  // must not let that read as "the code didn't work" (it did).
  const { isSignUpComplete, nextStep } = await confirmSignUp({
    username: input.identifier,
    confirmationCode: input.otp,
  });

  let autoSignInFailed = false;
  if (nextStep.signUpStep === "COMPLETE_AUTO_SIGN_IN") {
    try {
      await autoSignIn();
    } catch (err) {
      autoSignInFailed = true;
      console.error(
        "[Cognito] autoSignIn failed after a successful confirmSignUp (account is confirmed, no session was established):",
        err,
      );
      if (err instanceof Error && err.name === "UserAlreadyAuthenticatedException") {
        // autoSignIn is one-shot and can't be retried once it's failed (see
        // AutoSignInException on a second attempt) - but a stale session
        // (e.g. from an earlier test in this browser, since there's no
        // signOut() wired into the UI yet) was the cause here, so clear it
        // opportunistically so the manual-login fallback below starts clean.
        await signOut().catch(() => {});
      }
    }
  }

  return { isSignUpComplete, autoSignInFailed };
}

export async function cognitoResendSignUpCode(identifier: string): Promise<void> {
  await resendSignUpCode({ username: identifier });
}

/**
 * Diagnostic helper: logs the decoded access/ID token claims for the current
 * Cognito session, if one exists. Amplify v6 has no public API to read the
 * raw refresh token out of fetchAuthSession() - it's kept internal to the
 * token provider and used automatically to refresh the other two tokens.
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

/**
 * Calls the Registration API's linking endpoint with the current Cognito
 * session's access token, then forces Amplify to refresh the session so the
 * newly-linked claims (rma_roles, rma_ids, profile_status) show up on the
 * access/ID tokens. This sidesteps the "Amplify exposes no raw refresh
 * token" problem entirely - we never send one. Per the agreed design:
 *
 *   1. We send only the access token to v2/register.
 *   2. The backend validates it, looks up PAS identifiers/roles, and calls
 *      Cognito's AdminUpdateUserAttributes to write them onto the user.
 *   3. We call fetchAuthSession({ forceRefresh: true }); Amplify uses its
 *      own internal refresh token to hit Cognito, which runs the
 *      Pre-Token-Generation Lambda and mints new tokens carrying the
 *      just-written attributes as claims.
 */
export async function registerCognitoProfile(): Promise<unknown> {
  const { tokens } = await fetchAuthSession();
  const accessToken = tokens?.accessToken?.toString();

  if (!accessToken) {
    console.log("[Cognito] registerCognitoProfile: no active session, skipping.");
    return undefined;
  }

  try {
    const response = await fetch(REGISTER_PROFILE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken }),
    });
    const body = await response.json().catch(() => undefined);
    console.log("[Cognito] v2/register response:", { status: response.status, body });

    if (!response.ok) {
      return body;
    }

    const refreshed = await fetchAuthSession({ forceRefresh: true });
    const refreshedAccessToken = refreshed.tokens?.accessToken?.toString();
    const refreshedIdToken = refreshed.tokens?.idToken?.toString();

    if (refreshedAccessToken) {
      console.log(
        "[Cognito] Refreshed access token claims (post-registration):",
        decodeJwt(refreshedAccessToken),
      );
      console.log("[Cognito] Refreshed raw access token (post-registration):", refreshedAccessToken);
    } else {
      console.log("[Cognito] forceRefresh returned no access token.");
    }
    if (refreshedIdToken) {
      console.log(
        "[Cognito] Refreshed ID token claims (post-registration):",
        decodeJwt(refreshedIdToken),
      );
    }

    return body;
  } catch (err) {
    console.log("[Cognito] v2/register request failed:", err);
    return undefined;
  }
}

/**
 * Picks the zone to land on from the current session's access token
 * https://rma.com/claims/rma_roles claim (Organization -> /company,
 * Individual -> /claimant), or null when the token carries no recognised role. Call after
 * registerCognitoProfile() so the session already holds the refreshed tokens -
 * fetchAuthSession() here just reads them back, no extra network call.
 */
export async function getCognitoRoleHomePath(): Promise<string | null> {
  const { tokens } = await fetchAuthSession();
  const roles = getRolesFromAccessToken(tokens?.accessToken?.payload);
  console.log("[Cognito] rma_roles from access token:", roles);
  return getRoleHomePath(roles);
}

export async function cognitoLogin(input: {
  persona: PersonaSlug;
  identifier: string;
  password: string;
}) {
  try {
    const { isSignedIn, nextStep } = await signIn({
      username: input.identifier,
      password: input.password,
    });
    return { isSignedIn, nextStep };
  } catch (err) {
    if (err instanceof Error && err.name === "UserAlreadyAuthenticatedException") {
      // A stale session (e.g. from an earlier test in this browser, since
      // there's no signOut() wired into the UI yet) is blocking sign-in for
      // a different account. Clear it and retry once.
      await signOut();
      const { isSignedIn, nextStep } = await signIn({
        username: input.identifier,
        password: input.password,
      });
      return { isSignedIn, nextStep };
    }
    throw err;
  }
}

/** Answers the sign-in MFA challenge with the SMS or email OTP. */
export async function cognitoConfirmSignInWithCode(otp: string) {
  const { isSignedIn, nextStep } = await confirmSignIn({
    challengeResponse: otp,
  });
  return { isSignedIn, nextStep };
}

/**
 * Picks the MFA channel when the user has more than one enabled
 * (CONTINUE_SIGN_IN_WITH_MFA_SELECTION). Cognito then sends the code and
 * returns the matching CONFIRM_SIGN_IN_WITH_*_CODE step.
 */
export async function cognitoSelectMfaType(type: "EMAIL" | "SMS") {
  const { isSignedIn, nextStep } = await confirmSignIn({
    challengeResponse: type,
  });
  return { isSignedIn, nextStep };
}

export async function cognitoForgotPassword(input: {
  persona: PersonaSlug;
  email: string;
}) {
  try {
    const output = await resetPassword({ username: input.email });
    return output;
  } catch (err) {
    console.error("[Cognito] resetPassword failed:", err);
    throw err;
  }
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
