// Logger for client components ("use client"). The server-side logger
// (lib/logger.ts) can't run in the browser - it needs the AWS keys - so this
// posts each entry to app/company/api/client-log/route.ts, which writes it to
// CloudWatch with the user's id attached.
//
//   clientLogger.error("Failed to load claims", { error, page });
//
// Never put tokens, passwords or personal data in the context.
export const CLIENT_LOG_ENDPOINT = "/company/api/client-log";

type ClientLogLevel = "info" | "warn" | "error";
const MAX_CONTEXT_CHARS = 6000;

/** Posts a payload to the client-log route. Never throws. */
export function sendToClientLog(payload: Record<string, unknown>) {
  try {
    const body = JSON.stringify(payload);
    const sent = navigator.sendBeacon?.(
      CLIENT_LOG_ENDPOINT,
      new Blob([body], { type: "application/json" }),
    );
    if (!sent) {
      void fetch(CLIENT_LOG_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Logging must never break the page.
  }
}

// JSON.stringify turns an Error into {}, so keep its useful parts explicitly
// (plus the HTTP status when it's an ApiError).
function serializeContext(context: Record<string, unknown>): unknown {
  const json = JSON.stringify(context, (_key, value) =>
    value instanceof Error
      ? {
          name: value.name,
          message: value.message,
          stack: value.stack,
          status: (value as Error & { status?: number }).status,
        }
      : value,
  );
  return json.length > MAX_CONTEXT_CHARS
    ? `[context omitted: ${json.length} chars]`
    : JSON.parse(json);
}

function log(level: ClientLogLevel, message: string, context?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const consoleMethod = level === "info" ? "log" : level;
  console[consoleMethod](message, context ?? "");

  let serialized: unknown;
  try {
    serialized = context && serializeContext(context);
  } catch {
    serialized = "[context not serializable]";
  }
  sendToClientLog({
    type: "log",
    level,
    message,
    context: serialized,
    page: window.location.pathname,
  });
}

export const clientLogger = {
  info: (message: string, context?: Record<string, unknown>) => log("info", message, context),
  warn: (message: string, context?: Record<string, unknown>) => log("warn", message, context),
  error: (message: string, context?: Record<string, unknown>) => log("error", message, context),
};
