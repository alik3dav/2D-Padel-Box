const FALLBACK_FILE_BASENAME = "padel-club-layout-v1";

export const sanitizeFileBaseName = (value: string) => {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9\s-_]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return normalized || FALLBACK_FILE_BASENAME;
};

export const withExtension = (baseName: string, extension: string) => {
  const normalizedBase = sanitizeFileBaseName(baseName);
  const normalizedExtension = extension.startsWith(".") ? extension : `.${extension}`;
  return `${normalizedBase}${normalizedExtension}`;
};

export const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};
