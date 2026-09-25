import { getServerCognitoSession } from "@/lib/auth/cognitoSession.server";
import apiService, { type ApiRequestOptions } from "./apiService";

/**
 * Server-side wrapper around `apiService` that attaches the Cognito access
 * token automatically. Use this from server components, server actions and
 * route handlers so the token never reaches the browser.
 *
 * Note: server components cannot write cookies, so a token refreshed here is
 * not persisted - the proxy refreshes it on the next request.
 */
async function withToken(options: ApiRequestOptions = {}): Promise<ApiRequestOptions> {
  if (options.skipAuth || options.token) return options;

  const { accessToken } = await getServerCognitoSession();
  if (!accessToken) throw new Error("No active Cognito session.");
  return { ...options, token: accessToken };
}

export const serverApiService = {
  async get<TResponse>(path: string, options?: ApiRequestOptions): Promise<TResponse> {
    return apiService.get<TResponse>(path, await withToken(options));
  },

  async post<TResponse>(
    path: string,
    body?: unknown,
    options?: ApiRequestOptions
  ): Promise<TResponse> {
    return apiService.post<TResponse>(path, body, await withToken(options));
  },

  async put<TResponse>(
    path: string,
    body?: unknown,
    options?: ApiRequestOptions
  ): Promise<TResponse> {
    return apiService.put<TResponse>(path, body, await withToken(options));
  },

  async patch<TResponse>(
    path: string,
    body?: unknown,
    options?: ApiRequestOptions
  ): Promise<TResponse> {
    return apiService.patch<TResponse>(path, body, await withToken(options));
  },

  async delete<TResponse>(path: string, options?: ApiRequestOptions): Promise<TResponse> {
    return apiService.delete<TResponse>(path, await withToken(options));
  },
};

export default serverApiService;
