export type PersonaSlug = "employee" | "employer";

export type PersonaConfig = {
  slug: PersonaSlug;
  label: string;
  /** What the persona's primary identifier field represents. */
  identifierKind: "id-number" | "member-number";
  identifierLabel: string;
  identifierPlaceholder: string;
  /** Zone the member lands in once registration is complete. */
  destination: string;
};

export const PERSONAS: Record<PersonaSlug, PersonaConfig> = {
  employee: {
    slug: "employee",
    label: "Employee",
    identifierKind: "id-number",
    identifierLabel: "South African ID (SA id) / Passport no.",
    identifierPlaceholder: "Enter your SA Id or passport no.",
    destination: "/individual",
  },
  employer: {
    slug: "employer",
    label: "Employer",
    identifierKind: "member-number",
    identifierLabel: "Member number",
    identifierPlaceholder: "Enter your member number",
    destination: "/company",
  },
};

export function getPersona(slug: string): PersonaConfig | undefined {
  return PERSONAS[slug as PersonaSlug];
}
