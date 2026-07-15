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
