/** "johndoe@example.com" -> "jo**@example.com" */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  return `${local.slice(0, 2)}**@${domain}`;
}
