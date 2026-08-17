

const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export type QueryParamValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<string | number | boolean>;

export interface ApiRequestOptions extends Omit<RequestInit, "body" | "method"> {
  /** Query params to append to the URL, auto-encoded. */
  params?: Record<string, QueryParamValue>;
  /** Override the configured base URL for this request. */
  baseUrl?: string;
  /**
   * Access token to send as `Authorization: Bearer <token>`.
   *
   * Auth0 keeps tokens in an encrypted httpOnly cookie, so they can't be read
   * from JS. Get one with `auth0.getAccessToken()` on the server (see
   * `serverApiService`), or `getAccessToken()` from `@auth0/nextjs-auth0` in a
   * client component.
   */
  token?: string;
  /** Skip auto-attaching the Authorization header for this request. */
  skipAuth?: boolean;
}

export interface ApiRequestOptionsWithBody extends ApiRequestOptions {
  body?: unknown;
}


export class ApiError<TData = unknown> extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly data: TData | undefined;
  readonly url: string;

  constructor(
    message: string,
    options: { status: number; statusText: string; data: TData | undefined; url: string }
  ) {
    super(message);
    this.name = "ApiError";
    this.status = options.status;
    this.statusText = options.statusText;
    this.data = options.data;
    this.url = options.url;
  }
}

function buildUrl(path: string, baseUrl: string, params?: Record<string, QueryParamValue>): string {
  const isAbsolute = /^https?:\/\//i.test(path);

  let url: URL;
  if (isAbsolute) {
    url = new URL(path);
  } else if (baseUrl) {
    // `new URL(path, baseUrl)` would treat a leading "/" in `path` as
    // path-absolute and discard any path segment already present in
    // baseUrl (e.g. an API Gateway stage/base path). Join them manually
    // so baseUrl's path is preserved.
    const trimmedBase = baseUrl.replace(/\/+$/, "");
    const trimmedPath = path.replace(/^\/+/, "");
    url = new URL(`${trimmedBase}/${trimmedPath}`);
  } else {
    // No base URL configured; fall back to window.location.origin in the
    // browser, or a dummy origin on the server (route handlers/server
    // components should pass a full URL or set NEXT_PUBLIC_API_BASE_URL).
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost";
    url = new URL(path, origin);
  }

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === null || value === undefined) continue;
      if (Array.isArray(value)) {
        for (const item of value) url.searchParams.append(key, String(item));
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

async function parseResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204 || response.status === 205) return undefined;

  const contentLength = response.headers.get("content-length");
  if (contentLength === "0") return undefined;

  const contentType = response.headers.get("content-type") ?? "";
  const text = await response.text();
  if (!text) return undefined;

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  return text;
}

async function request<TResponse>(
  method: string,
  path: string,
  options: ApiRequestOptionsWithBody = {}
): Promise<TResponse> {
  const { params, baseUrl, token, skipAuth, headers, body, ...fetchOptions } = options;

  const url = buildUrl(path, baseUrl ?? DEFAULT_BASE_URL, params);

  const requestHeaders = new Headers(headers);

  const hasBody = body !== undefined && !(body instanceof FormData);
  if (hasBody && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (!skipAuth && token && !requestHeaders.has("Authorization")) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...fetchOptions,
    method,
    headers: requestHeaders,
    body:
      body === undefined
        ? undefined
        : body instanceof FormData
          ? body
          : JSON.stringify(body),
  });

  const data = await parseResponseBody(response);

  if (!response.ok) {
    throw new ApiError(
      `Request failed with status ${response.status} ${response.statusText} for ${url}`,
      { status: response.status, statusText: response.statusText, data, url }
    );
  }

  return data as TResponse;
}

export const apiService = {
  get<TResponse>(path: string, options?: ApiRequestOptions): Promise<TResponse> {
    return request<TResponse>("GET", path, options);
  },

  post<TResponse>(path: string, body?: unknown, options?: ApiRequestOptions): Promise<TResponse> {
    return request<TResponse>("POST", path, { ...options, body });
  },

  put<TResponse>(path: string, body?: unknown, options?: ApiRequestOptions): Promise<TResponse> {
    return request<TResponse>("PUT", path, { ...options, body });
  },

  patch<TResponse>(path: string, body?: unknown, options?: ApiRequestOptions): Promise<TResponse> {
    return request<TResponse>("PATCH", path, { ...options, body });
  },

  delete<TResponse>(path: string, options?: ApiRequestOptions): Promise<TResponse> {
    return request<TResponse>("DELETE", path, options);
  },
};

export default apiService;
