const EXTENSION_TO_MIME_TYPE: Record<string, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  csv: "text/csv",
  txt: "text/plain",
};

const MIME_TYPE_TO_EXTENSION: Record<string, string> = Object.fromEntries(
  Object.entries(EXTENSION_TO_MIME_TYPE).map(([extension, mimeType]) => [mimeType, extension]),
);

/**
 * Some APIs send `fileType` as a bare extension (e.g. "pdf") rather than a
 * real MIME type. A Blob with a bare-extension/unrecognized `type` and a
 * `fileName` with no extension makes Chrome fall back to saving it as
 * `.txt`, so resolve both to a real MIME type + matching extension.
 */
function resolveMimeType(fileType: string): string {
  if (fileType.includes("/")) return fileType;
  return EXTENSION_TO_MIME_TYPE[fileType.replace(/^\./, "").toLowerCase()] ?? "application/octet-stream";
}

function resolveFileName(fileName: string, mimeType: string): string {
  const baseName = fileName.trim() || "download";
  if (/\.[a-zA-Z0-9]+$/.test(baseName)) return baseName;

  // Only append an extension we actually recognize — "application/octet-stream"
  // (the fallback for an unrecognized fileType) has no real extension to guess.
  const extension = MIME_TYPE_TO_EXTENSION[mimeType];
  return extension ? `${baseName}.${extension}` : baseName;
}

export function downloadBase64File(fileName: string, contentType: string, base64Content: string) {
  const mimeType = resolveMimeType(contentType);

  const byteChars = atob(base64Content);
  const byteNumbers = new Uint8Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i);

  const blob = new Blob([byteNumbers], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = resolveFileName(fileName, mimeType);
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
