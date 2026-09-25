// Shrinks a request body to something safe to put in a log line. Used on both
// the browser (apiCallReporter) and server (serverApiService) side.
//
// Uploads send whole files as base64 strings or FormData - megabytes that
// would blow past sendBeacon's ~64 KB and CloudWatch's 256 KB event limits -
// so long strings are replaced by their length and files by name and size.
// Sensitive keys (tokens, emails, phone numbers, ID numbers...) are redacted
// later by the server-side logger.
const LOGGED_BODY_METHODS = new Set(["POST", "PUT", "PATCH"]);
const MAX_FIELD_CHARS = 500;
const MAX_BODY_CHARS = 6000;

export function summarizeRequestBody(method: string, body: unknown): unknown {
  if (body === undefined || body === null || !LOGGED_BODY_METHODS.has(method)) {
    return undefined;
  }

  if (typeof FormData !== "undefined" && body instanceof FormData) {
    const fields: Record<string, string> = {};
    body.forEach((value, key) => {
      fields[key] =
        typeof value === "string"
          ? value.slice(0, MAX_FIELD_CHARS)
          : `[file ${value.name}, ${value.size} bytes]`;
    });
    return fields;
  }

  try {
    const json = JSON.stringify(body, (_key, value) =>
      typeof value === "string" && value.length > MAX_FIELD_CHARS
        ? `[${value.length} chars omitted]`
        : value,
    );
    if (json === undefined) return undefined;
    if (json.length > MAX_BODY_CHARS) return `[request body omitted: ${json.length} chars]`;
    return JSON.parse(json);
  } catch {
    return "[request body not serializable]";
  }
}
