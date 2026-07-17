/**
 * Resolve URL de mídia da API (absoluta ou relativa a NEXT_PUBLIC_API_URL).
 */
export function resolveMediaUrl(url: string | null | undefined): string {
  const trimmed = url?.trim() ?? "";
  if (!trimmed) return "";

  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("blob:")) {
    return trimmed;
  }

  const base = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
  if (!base) {
    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  }

  return trimmed.startsWith("/") ? `${base}${trimmed}` : `${base}/${trimmed}`;
}

/**
 * URL otimizada para listagens (thumbnail quando disponível).
 */
export function resolveListingPhotoUrl(photo: {
  thumbnailPublicUrl?: string | null;
  publicUrl?: string | null;
}): string {
  return resolveMediaUrl(
    photo.thumbnailPublicUrl?.trim() || photo.publicUrl?.trim() || "",
  );
}

/**
 * URL completa para detalhe / editor.
 */
export function resolveFullPhotoUrl(photo: {
  publicUrl?: string | null;
}): string {
  return resolveMediaUrl(photo.publicUrl);
}
