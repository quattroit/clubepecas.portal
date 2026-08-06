import type { QuotationDraftItem } from "@/components/providers/QuotationDraftProvider";

/**
 * Rascunho local da Central de Cotações — isolado por usuário para evitar
 * mistura de itens entre contas no mesmo navegador.
 */
export function quotationDraftStorageKey(userId: number): string {
  return `clubepecas.quotation.${userId}`;
}

export function loadQuotationDraft(userId: number): QuotationDraftItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(quotationDraftStorageKey(userId));
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as QuotationDraftItem[]) : [];
  } catch {
    return [];
  }
}

export function saveQuotationDraft(
  userId: number,
  items: QuotationDraftItem[],
): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      quotationDraftStorageKey(userId),
      JSON.stringify(items),
    );
  } catch {
    // localStorage indisponível (modo privado, quota) — segue apenas em memória.
  }
}
