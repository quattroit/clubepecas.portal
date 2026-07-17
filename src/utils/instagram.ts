/**
 * Normaliza handle ou URL do Instagram para o username (sem @).
 */
export function normalizeInstagramHandle(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const urlMatch = trimmed.match(/instagram\.com\/([^/?#]+)/i);
  if (urlMatch?.[1]) {
    return urlMatch[1].replace(/^@/, "");
  }

  return trimmed.replace(/^@/, "");
}

/**
 * Monta URL pública do perfil no Instagram.
 */
export function buildInstagramUrl(handleOrUrl: string): string | null {
  const handle = normalizeInstagramHandle(handleOrUrl);
  if (!handle) return null;
  return `https://www.instagram.com/${handle}/`;
}

/**
 * Exibe o handle com @ (ex.: @loja).
 */
export function formatInstagramHandle(handleOrUrl: string): string {
  const handle = normalizeInstagramHandle(handleOrUrl);
  return handle ? `@${handle}` : "";
}
