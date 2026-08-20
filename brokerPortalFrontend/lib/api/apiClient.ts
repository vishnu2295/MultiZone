import { getFreshToken } from "@/lib/auth";

const BASE_URL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_URL          // server-side: direct
    : "/brokerPortal/api/cc";                  // client-side: through Next.js rewrite

type FetchOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

/**
 * Central API client — automatically attaches a fresh auth token to every request.
 * All API files should use this instead of raw fetch.
 */
export async function apiClient<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const token = await getFreshToken();

  console.log(`Sending request to ${path} with token:`, token ? "TOKEN EXISTS" : "NO TOKEN");

  if (!token) throw new Error("Session expired. Please log in again.");

  const isFormData = options.body instanceof FormData;

  // Add timeout to fetch
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        ...(!isFormData && { "Content-Type": "application/json" }),
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 304) return { success: true, data: [] } as unknown as T;

    const text = await res.text();
    let json: any;
    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      if (!res.ok) throw new Error(text || `Request failed with status ${res.status}`);
      return text as unknown as T;
    }

    if (!res.ok) {
      const error: any = new Error(json.message || `Request failed with status ${res.status}`);
      error.data = json;
      throw error;
    }

    return json;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout - backend may be unresponsive');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
