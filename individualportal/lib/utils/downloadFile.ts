/** Decodes a base64-encoded file payload and triggers a browser download. */
export function downloadBase64File(
  fileName: string,
  contentType: string,
  base64Content: string,
) {
  const byteChars = atob(base64Content);
  const byteNumbers = new Uint8Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i);

  const blob = new Blob([byteNumbers], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

/** Fetches a binary file from an authenticated endpoint and triggers a browser download. */
export async function downloadFile(
  url: string,
  fileName: string,
  options?: { token?: string; method?: "GET" | "POST"; body?: unknown },
): Promise<void> {
  const response = await fetch(url, {
    method: options?.method ?? "GET",
    headers: {
      ...(options?.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options?.body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    body: options?.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(objectUrl);
}
