/** Fetches a binary file from an authenticated endpoint and triggers a browser download. */
export async function downloadFile(
  url: string,
  fileName: string,
  options?: { token?: string },
): Promise<void> {
  const response = await fetch(url, {
    headers: options?.token ? { Authorization: `Bearer ${options.token}` } : undefined,
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
