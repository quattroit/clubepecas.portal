/**
 * Resolve a URL pública de exibição de uma foto (PublicUrl com fallback legado).
 */
export function resolvePhotoPublicUrl(photo: {
  publicUrl?: string | null;
  url?: string | null;
}): string {
  const value = photo.publicUrl?.trim() || photo.url?.trim() || "";
  return value;
}
