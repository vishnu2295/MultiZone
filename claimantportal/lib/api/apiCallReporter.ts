// Browser-side reporting of backend API calls. The browser can't write to
// CloudWatch itself (that would ship the AWS keys to every visitor), so it
// posts a short summary of the call to this app's server, which logs it - see
// app/claimant/api/client-log/route.ts. Server-side calls are logged directly
// by serverApiService instead.
import { sendToClientLog } from "@/lib/clientLogger";
import { summarizeRequestBody } from "./summarizeRequestBody";

export interface ApiCallReport {
  method: string;
  url: string;
  /** HTTP status, or 0 when the request never got a response (network error). */
  status: number;
  statusText?: string;
  startedAt: number;
  /** Request body as passed to apiService; logged for POST/PUT/PATCH only. */
  body?: unknown;
  error?: string;
}

/**
 * Reports failed calls and successful writes (POST/PUT/PATCH/DELETE).
 * Successful GETs are skipped so page loads don't double their request count.
 * No-op on the server.
 */
export function reportApiCall(report: ApiCallReport) {
  if (typeof window === "undefined") return;
  const ok = report.status >= 200 && report.status < 400;
  if (ok && report.method === "GET") return;

  sendToClientLog({
    type: "api-call",
    method: report.method,
    url: report.url,
    status: report.status,
    statusText: report.statusText,
    durationMs: Date.now() - report.startedAt,
    error: report.error,
    requestBody: summarizeRequestBody(report.method, report.body),
    page: window.location.pathname,
  });
}
