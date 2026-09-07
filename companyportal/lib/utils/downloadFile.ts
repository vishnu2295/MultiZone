export function downloadBase64File(fileName: string, contentType: string, base64Content: string) {
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

/**
 * Downloads a file from a remote URL (e.g. blob storage) in the current tab
 * instead of via window.open, which pops a new tab/window.
 */
export function downloadFileFromUrl(url: string, fileName?: string) {
  const link = document.createElement("a");
  link.href = url;
  if (fileName) link.download = fileName;
  link.rel = "noopener";
  link.click();
}
