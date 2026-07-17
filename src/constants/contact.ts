/**
 * Contato institucional — substituir por dados reais antes da publicação.
 * Pode ser sobrescrito via variáveis de ambiente.
 */
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "pecasclube@gmail.com";

/** Perfil público no Instagram. */
export const INSTAGRAM_HANDLE =
  process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE ?? "siteclubepecas";

export const INSTAGRAM_URL =
  process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
  `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

export const CONTACT_HOURS =
  process.env.NEXT_PUBLIC_CONTACT_HOURS ??
  "Segunda a sexta, das 9h às 18h (horário de Brasília)";

/** Data de vigência exibida em Termos e Privacidade. */
export const LEGAL_EFFECTIVE_DATE = "15 de julho de 2026";
