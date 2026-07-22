import { toast } from "sonner";

import { buildRepresentativePublicUrl } from "@/utils/representativeReferral";

export function getRepresentativePublicUrl(code: string): string {
  return buildRepresentativePublicUrl(code);
}

export async function copyRepresentativePublicLink(code: string): Promise<boolean> {
  const url = getRepresentativePublicUrl(code);
  try {
    await navigator.clipboard.writeText(url);
    toast.success("Link copiado.");
    return true;
  } catch {
    toast.error("Não foi possível copiar o link.");
    return false;
  }
}

export function openRepresentativePublicLink(code: string): void {
  const url = getRepresentativePublicUrl(code);
  window.open(url, "_blank", "noopener,noreferrer");
}

export async function shareRepresentativePublicLink(
  code: string,
  name?: string,
): Promise<void> {
  const url = getRepresentativePublicUrl(code);
  const title = "ClubePeças — Indicação";
  const text = name
    ? `Cadastre-se no ClubePeças com a indicação de ${name}`
    : "Cadastre-se no ClubePeças";

  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({ title, text, url });
      return;
    } catch (error) {
      // Usuário cancelou o share — não fallback para cópia.
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
    }
  }

  await copyRepresentativePublicLink(code);
}
