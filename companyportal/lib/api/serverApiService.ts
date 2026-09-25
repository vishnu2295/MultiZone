import { getServerCognitoSession } from "@/lib/auth/cognitoSession.server";
import { logger } from "@/lib/logger";
import apiService, {
  ApiError,
  resolveApiUrl,
  type ApiRequestOptions,
} from "./apiService";
import { summarizeRequestBody } from "./summarizeRequestBody";

/**
 * Server-side wrapper around `apiService` that attaches the Cognito access
 * token automatically. Use this from server components, server actions and
 * route handlers so the token never reaches the browser.
 *
 * Note: server components cannot write cookies, so a token refreshed here is
 * not persisted - the proxy refreshes it on the next request.
 */
async function withToken(
  options: ApiRequestOptions = {},
): Promise<ApiRequestOptions> {
  if (options.skipAuth || options.token) return options;

  const { accessToken } = await getServerCognitoSession();
  if (!accessToken) throw new Error("No active Cognito session.");
  return { ...options, token: accessToken };
}

// Logs every backend call's outcome, full URL and duration, plus the request
// body for POST/PUT/PATCH (shortened by summarizeRequestBody; the logger
// redacts sensitive keys). ApiError's message is skipped - it repeats the URL.
async function logged<TResponse>(
  method: string,
  path: string,
  options: ApiRequestOptions | undefined,
  body: unknown,
  call: () => Promise<TResponse>,
): Promise<TResponse> {
  const startedAt = Date.now();
  const details = () => ({
    method,
    url: resolveApiUrl(path, options),
    requestBody: summarizeRequestBody(method, body),
    durationMs: Date.now() - startedAt,
  });
  try {
    const result = await call();
    // Writes are worth an audit line; reads only at debug level.
    const log = method === "GET" ? logger.debug : logger.info;
    log("Backend API call succeeded", details());
    return result;
  } catch (error) {
    const isClientError = error instanceof ApiError && error.status < 500;
    (isClientError ? logger.warn : logger.error)("Backend API call failed", {
      ...details(),
      ...(error instanceof ApiError
        ? { status: error.status, statusText: error.statusText }
        : { error }),
    });
    throw error;
  }
}

export const serverApiService = {
  async get<TResponse>(
    path: string,
    options?: ApiRequestOptions,
  ): Promise<TResponse> {
    return logged("GET", path, options, undefined, async () =>
      apiService.get<TResponse>(path, await withToken(options)),
    );
  },

  async post<TResponse>(
    path: string,
    body?: unknown,
    options?: ApiRequestOptions,
  ): Promise<TResponse> {
    return logged("POST", path, options, body, async () =>
      apiService.post<TResponse>(path, body, await withToken(options)),
    );
  },

  async put<TResponse>(
    path: string,
    body?: unknown,
    options?: ApiRequestOptions,
  ): Promise<TResponse> {
    return logged("PUT", path, options, body, async () =>
      apiService.put<TResponse>(path, body, await withToken(options)),
    );
  },

  async patch<TResponse>(
    path: string,
    body?: unknown,
    options?: ApiRequestOptions,
  ): Promise<TResponse> {
    return logged("PATCH", path, options, body, async () =>
      apiService.patch<TResponse>(path, body, await withToken(options)),
    );
  },

  async delete<TResponse>(
    path: string,
    options?: ApiRequestOptions,
  ): Promise<TResponse> {
    return logged("DELETE", path, options, undefined, async () =>
      apiService.delete<TResponse>(path, await withToken(options)),
    );
  },
};

export default serverApiService;
