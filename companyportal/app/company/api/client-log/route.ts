import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { logger } from "@/lib/logger";

// Receives entries from the browser and writes them to CloudWatch: backend API
// call reports (lib/api/apiCallReporter.ts) and manual logs from client
// components (lib/clientLogger.ts). Payloads are size-capped, fields are
// validated and whitelisted, and each client IP is rate-limited.
const MAX_BODY_CHARS = 16 * 1024;
const RATE_LIMIT_PER_MINUTE = 60;
const METHODS = new Set(["GET", "POST", "PUT", "PATCH", "DELETE"]);
const LEVELS = new Set(["info", "warn", "error"]);

const hitsByIp = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  if (hitsByIp.size > 10_000) hitsByIp.clear();
  const entry = hitsByIp.get(ip);
  if (!entry || entry.resetAt <= now) {
    hitsByIp.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_PER_MINUTE;
}

function asString(value: unknown, maxLength: number): string | undefined {
  return typeof value === "string" ? value.slice(0, maxLength) : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (isRateLimited(ip)) {
    return new NextResponse(null, { status: 429 });
  }

  const text = await request.text();
  if (text.length > MAX_BODY_CHARS) {
    return new NextResponse(null, { status: 413 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(text);
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  if (!payload || typeof payload !== "object") {
    return new NextResponse(null, { status: 400 });
  }

  const session = await auth0.getSession().catch(() => null);
  const userId = session?.user.sub;
  const page = asString(payload.page, 500)?.split("?")[0];

  // Manual entry from clientLogger.
  if (payload.type === "log") {
    const level = asString(payload.level, 10);
    const message = asString(payload.message, 500);
    if (!level || !LEVELS.has(level) || !message) {
      return new NextResponse(null, { status: 400 });
    }
    logger[level as "info" | "warn" | "error"](message, {
      source: "browser",
      // Already size-capped by the browser; the logger redacts sensitive keys.
      context:
        typeof payload.context === "object" || typeof payload.context === "string"
          ? payload.context
          : undefined,
      page,
      userId,
    });
    return new NextResponse(null, { status: 204 });
  }

  const method = asString(payload.method, 10)?.toUpperCase();
  const status = asNumber(payload.status);
  if (!method || !METHODS.has(method) || status === undefined) {
    return new NextResponse(null, { status: 400 });
  }

  const context = {
    source: "browser",
    method,
    url: asString(payload.url, 2000),
    status,
    statusText: asString(payload.statusText, 100),
    durationMs: asNumber(payload.durationMs),
    error: asString(payload.error, 1000),
    // Already size-capped by the browser; the logger redacts sensitive keys.
    requestBody:
      typeof payload.requestBody === "object" || typeof payload.requestBody === "string"
        ? payload.requestBody
        : undefined,
    page,
    userId,
  };

  // 0 = no response at all (network/CORS failure).
  if (status === 0 || status >= 500) {
    logger.error("Backend API call failed", context);
  } else if (status >= 400) {
    logger.warn("Backend API call failed", context);
  } else {
    logger.info("Backend API call succeeded", context);
  }

  return new NextResponse(null, { status: 204 });
}
