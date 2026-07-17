/**
 * Compartilha via Web Share API quando disponível;
 * caso contrário (ou se falhar), copia a URL para a área de transferência.
 */
export async function shareOrCopyUrl(options: {
  url: string;
  title: string;
  text?: string;
}): Promise<"shared" | "copied"> {
  const { url, title, text } = options;

  if (
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function"
  ) {
    try {
      await navigator.share({ title, text, url });
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw error;
      }
    }
  }

  await navigator.clipboard.writeText(url);
  return "copied";
}

/** Monta URL absoluta a partir de um path (ex.: `/lojas/slug`). */
export function toAbsoluteUrl(path: string): string {
  if (typeof window === "undefined") {
    return path;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${window.location.origin}${normalized}`;
}
