/** Decodes a JWT's payload without verifying its signature. For inspecting
 * claims client-side only - never trust an unverified payload for auth
 * decisions; verification must happen server-side. Works in both the browser
 * and Node. */
export function decodeJwt(token: string): Record<string, unknown> {
  const payload = token.split(".")[1];
  const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

  const json =
    typeof window === "undefined"
      ? Buffer.from(padded, "base64").toString("utf8")
      : decodeURIComponent(
          atob(padded)
            .split("")
            .map((char) => "%" + char.charCodeAt(0).toString(16).padStart(2, "0"))
            .join(""),
        );

  return JSON.parse(json);
}
