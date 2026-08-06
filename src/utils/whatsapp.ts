import { APP_NAME } from "@/constants/app";

/**
 * Mantém apenas dígitos do telefone/WhatsApp.
 */
export function toWhatsAppDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

/**
 * Mensagem padrão de contato a partir de um anúncio.
 */
export function buildAdvertisementWhatsAppMessage(
  title: string,
  advertisementUrl: string,
): string {
  return `Olá! Gostaria de falar sobre o item “${title}” que encontrei no site ${APP_NAME}: ${advertisementUrl}`;
}

/**
 * Mensagem padrão ao contatar uma loja pelo perfil público.
 */
export function buildStoreWhatsAppMessage(): string {
  return `Olá, estou entrando em contato através do site ${APP_NAME}`;
}

export type QuotationWhatsAppItem = {
  title: string;
  quantity: number;
  advertisementId: number;
  slug?: string;
  itemNotes?: string | null;
};

/**
 * Mensagem de solicitação de cotação com a lista de peças.
 */
export function buildQuotationWhatsAppMessage(input: {
  storeName: string;
  quotationNumber: string;
  items: QuotationWhatsAppItem[];
  generalNotes?: string | null;
  origin?: string;
}): string {
  const lines: string[] = [
    "Olá!",
    "",
    `Gostaria de solicitar uma cotação através do ${APP_NAME}.`,
    `Solicitação: ${input.quotationNumber}`,
    "",
    "Peças:",
  ];

  for (const item of input.items) {
    const qtyLabel = item.quantity === 1 ? "1 un." : `${item.quantity} un.`;
    lines.push(`• ${item.title} (${qtyLabel}) — cód. ${item.advertisementId}`);
    if (item.slug && input.origin) {
      lines.push(`  ${input.origin.replace(/\/$/, "")}/anuncios/${item.slug}`);
    }
    if (item.itemNotes?.trim()) {
      lines.push(`  Obs.: ${item.itemNotes.trim()}`);
    }
  }

  const notes = input.generalNotes?.trim();
  if (notes) {
    lines.push("", "Observações gerais:", notes);
  }

  lines.push(
    "",
    "Poderia informar disponibilidade, valores e condições?",
    "",
    "Obrigado!",
  );

  return lines.join("\n");
}

/**
 * URL wa.me com texto pré-preenchido.
 * Assume BR (+55) quando o número tiver 10–11 dígitos sem código do país.
 */
export function buildWhatsAppUrl(
  phone: string,
  text: string,
): string | null {
  const digits = toWhatsAppDigits(phone);
  if (!digits) return null;

  const withCountry =
    digits.startsWith("55") || digits.length > 11 ? digits : `55${digits}`;

  return `https://wa.me/${withCountry}?text=${encodeURIComponent(text)}`;
}
