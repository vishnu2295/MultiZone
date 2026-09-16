import type { PersonaSlug } from "@/lib/personas";

// Stub service layer for the custom Cognito registration flow. Every function
// here simulates a network call and always resolves - swap the body for a
// real API call once it's available, the call sites won't need to change.

const STUB_DELAY_MS = 600;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

// TODO(API): replace with a real Cognito SignUp() call (or a server route wrapping it).
export async function cognitoSignUp(input: {
  persona: PersonaSlug;
  identifier: string;
  password: string;
}): Promise<{ success: true }> {
  console.log("[STUB] cognitoSignUp", {
    persona: input.persona,
    identifier: input.identifier,
  });
  await delay(STUB_DELAY_MS);
  return { success: true };
}

// TODO(API): replace with a real Cognito ConfirmSignUp() call.
export async function cognitoConfirmSignUp(input: {
  persona: PersonaSlug;
  identifier: string;
  otp: string;
}): Promise<{ success: true }> {
  console.log("[STUB] cognitoConfirmSignUp", input);
  await delay(STUB_DELAY_MS);
  return { success: true };
}
