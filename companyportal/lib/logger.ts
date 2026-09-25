import os from "node:os";
import {
  CloudWatchLogsClient,
  CreateLogStreamCommand,
  PutLogEventsCommand,
  type InputLogEvent,
} from "@aws-sdk/client-cloudwatch-logs";

/**
 * Server-side structured logger. Every entry is written to the console as one
 * JSON line (pm2 captures these in ./logs) and, when CW_LOG_GROUP is set,
 * batched and shipped to AWS CloudWatch Logs.
 *
 * AWS credentials come from the SDK's default chain: AWS_ACCESS_KEY_ID /
 * AWS_SECRET_ACCESS_KEY in the environment, or the EC2 instance role when
 * those are unset. Server-only - never import this from a client component.
 */

type LogLevel = "debug" | "info" | "warn" | "error";
export type LogContext = Record<string, unknown>;

const LEVELS: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };
const SERVICE = process.env.LOG_SERVICE_NAME || "companyportal";
const MIN_LEVEL = LEVELS[process.env.LOG_LEVEL as LogLevel] ?? LEVELS.info;
const LOG_GROUP = process.env.CW_LOG_GROUP;

// Keys whose values must never reach the logs (tokens, credentials, PII).
const SENSITIVE_KEY =
  /pass(word)?|secret|token|authori[sz]ation|cookie|api[-_]?key|id[-_]?number|email|phone|mobile/i;
const MAX_DEPTH = 6;
const MAX_STRING = 4000;

// CloudWatch PutLogEvents limits: 10,000 events / 1 MiB per call (each event
// costs its UTF-8 size + 26 bytes), 256 KiB per event.
const FLUSH_INTERVAL_MS = 2000;
const FLUSH_AT_EVENTS = 500;
const MAX_BATCH_EVENTS = 1000;
const MAX_BATCH_BYTES = 900 * 1024;
const MAX_EVENT_CHARS = 200 * 1024;
const MAX_BUFFER = 10_000;

function sanitize(value: unknown, depth = 0): unknown {
  if (typeof value === "string") {
    return value.length > MAX_STRING ? `${value.slice(0, MAX_STRING)}...[truncated]` : value;
  }
  if (typeof value === "bigint") return value.toString();
  if (value === null || typeof value !== "object") return value;
  if (depth >= MAX_DEPTH) return "[truncated]";

  if (value instanceof Error) {
    const digest = (value as Error & { digest?: unknown }).digest;
    return {
      name: value.name,
      message: sanitize(value.message, depth + 1),
      stack: sanitize(value.stack, depth + 1),
      ...(digest !== undefined && { digest: String(digest) }),
      ...(value.cause !== undefined && { cause: sanitize(value.cause, depth + 1) }),
    };
  }
  if (Array.isArray(value)) {
    return value.slice(0, 50).map((item) => sanitize(item, depth + 1));
  }

  const result: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value)) {
    // Booleans (e.g. hasAccessToken) can't leak a secret, so they're kept.
    const redact = SENSITIVE_KEY.test(key) && typeof item !== "boolean";
    result[key] = redact ? "[redacted]" : sanitize(item, depth + 1);
  }
  return result;
}

interface Shipper {
  client: CloudWatchLogsClient;
  logGroupName: string;
  logStreamName: string;
  buffer: InputLogEvent[];
  streamReady: boolean;
  flushing: Promise<void> | null;
  lastFailureAt: number;
}

// Kept on globalThis so the proxy and app bundles (and dev hot reloads) share
// one buffer and one timer per process instead of each creating their own.
const globalForLogger = globalThis as typeof globalThis & {
  __cloudWatchShipper?: Shipper | null;
};

function getShipper(): Shipper | null {
  if (globalForLogger.__cloudWatchShipper !== undefined) {
    return globalForLogger.__cloudWatchShipper;
  }
  if (!LOG_GROUP) {
    globalForLogger.__cloudWatchShipper = null;
    return null;
  }

  const date = new Date().toISOString().slice(0, 10);
  const shipper: Shipper = {
    client: new CloudWatchLogsClient({ region: process.env.AWS_REGION }),
    logGroupName: LOG_GROUP,
    logStreamName: `${os.hostname()}-${process.pid}-${date}`,
    buffer: [],
    streamReady: false,
    flushing: null,
    lastFailureAt: 0,
  };
  setInterval(() => void flushLogs(), FLUSH_INTERVAL_MS).unref();
  globalForLogger.__cloudWatchShipper = shipper;
  return shipper;
}

function takeBatch(buffer: InputLogEvent[]): InputLogEvent[] {
  let bytes = 0;
  let count = 0;
  while (count < buffer.length && count < MAX_BATCH_EVENTS) {
    const size = Buffer.byteLength(buffer[count].message ?? "") + 26;
    if (count > 0 && bytes + size > MAX_BATCH_BYTES) break;
    bytes += size;
    count++;
  }
  // PutLogEvents rejects batches that aren't in chronological order.
  return buffer.splice(0, count).sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0));
}

async function ensureStream(shipper: Shipper) {
  if (shipper.streamReady) return;
  try {
    await shipper.client.send(
      new CreateLogStreamCommand({
        logGroupName: shipper.logGroupName,
        logStreamName: shipper.logStreamName,
      }),
    );
  } catch (error) {
    if ((error as Error).name !== "ResourceAlreadyExistsException") throw error;
  }
  shipper.streamReady = true;
}

// Logs to the console directly - going through the logger here would queue
// the failure for the very upload that just failed. Throttled to once a minute.
function reportUploadFailure(shipper: Shipper, error: unknown, lostEvents: number) {
  const now = Date.now();
  if (now - shipper.lastFailureAt < 60_000) return;
  shipper.lastFailureAt = now;
  console.error(
    JSON.stringify({
      timestamp: new Date(now).toISOString(),
      level: "error",
      service: SERVICE,
      message: "CloudWatch log upload failed; events dropped",
      lostEvents,
      error: sanitize(error),
    }),
  );
}

/** Uploads everything buffered so far. Safe to call concurrently. */
export function flushLogs(): Promise<void> {
  const shipper = getShipper();
  if (!shipper) return Promise.resolve();
  if (shipper.flushing) return shipper.flushing;

  shipper.flushing = (async () => {
    while (shipper.buffer.length > 0) {
      const batch = takeBatch(shipper.buffer);
      try {
        await ensureStream(shipper);
        await shipper.client.send(
          new PutLogEventsCommand({
            logGroupName: shipper.logGroupName,
            logStreamName: shipper.logStreamName,
            logEvents: batch,
          }),
        );
      } catch (error) {
        // Stream deleted out from under us - recreate it on the next flush.
        if ((error as Error).name === "ResourceNotFoundException") shipper.streamReady = false;
        reportUploadFailure(shipper, error, batch.length);
        break;
      }
    }
  })().finally(() => {
    shipper.flushing = null;
  });
  return shipper.flushing;
}

function write(level: LogLevel, message: string, context?: LogContext) {
  if (LEVELS[level] < MIN_LEVEL) return;

  const now = Date.now();
  const entry = {
    timestamp: new Date(now).toISOString(),
    level,
    service: SERVICE,
    message,
    ...(context && (sanitize(context) as LogContext)),
  };
  let line = JSON.stringify(entry);
  if (line.length > MAX_EVENT_CHARS) line = `${line.slice(0, MAX_EVENT_CHARS)}...[truncated]`;

  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);

  const shipper = getShipper();
  if (!shipper) return;

  shipper.buffer.push({ timestamp: now, message: line });
  // CloudWatch unreachable for a while - drop the oldest rather than grow unbounded.
  if (shipper.buffer.length > MAX_BUFFER) shipper.buffer.shift();
  if (shipper.buffer.length >= FLUSH_AT_EVENTS) void flushLogs();
}

export interface Logger {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext): void;
  /** Returns a logger that adds `bindings` to every entry. */
  child(bindings: LogContext): Logger;
}

function createLogger(bindings: LogContext = {}): Logger {
  const log = (level: LogLevel) => (message: string, context?: LogContext) =>
    write(level, message, { ...bindings, ...context });
  return {
    debug: log("debug"),
    info: log("info"),
    warn: log("warn"),
    error: log("error"),
    child: (more) => createLogger({ ...bindings, ...more }),
  };
}

export const logger = createLogger();

