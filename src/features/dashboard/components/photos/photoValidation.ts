export const PHOTO_ACCEPT =
  "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";

export const PHOTO_ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const PHOTO_ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
]);

export type PhotoValidationResult =
  | { ok: true }
  | { ok: false; message: string };

function getExtension(fileName: string): string {
  const index = fileName.lastIndexOf(".");
  if (index < 0) return "";
  return fileName.slice(index).toLowerCase();
}

export function validatePhotoFile(
  file: File,
  maxFileSizeMB: number,
): PhotoValidationResult {
  const extension = getExtension(file.name);
  if (!PHOTO_ALLOWED_EXTENSIONS.has(extension)) {
    return {
      ok: false,
      message: `"${file.name}": extensão não permitida. Use JPG, PNG ou WEBP.`,
    };
  }

  const type = (file.type || "").toLowerCase();
  if (!PHOTO_ALLOWED_TYPES.has(type)) {
    return {
      ok: false,
      message: `"${file.name}": tipo de arquivo inválido.`,
    };
  }

  const maxBytes = Math.max(1, maxFileSizeMB) * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      ok: false,
      message: `"${file.name}": excede o limite de ${maxFileSizeMB} MB.`,
    };
  }

  if (file.size <= 0) {
    return {
      ok: false,
      message: `"${file.name}": arquivo vazio.`,
    };
  }

  return { ok: true };
}

export function fileFingerprint(file: File): string {
  return `${file.name}::${file.size}::${file.lastModified}`;
}
