/**
 * Configuração centralizada da persistência de indicação (Sprint 10.4).
 * Valor fixo nesta sprint; futuro: PlatformSettings.
 */
export const ReferralSettings = {
  /** Nome do cookie e chave lógica da indicação. */
  cookieName: "representativeCode",
  /** Chave LocalStorage (mesmo nome para compatibilidade com 10.3). */
  localStorageKey: "representativeCode",
  expirationDays: 30,
  structureVersion: 1,
  /** SameSite do cookie. */
  cookieSameSite: "Lax" as const,
} as const;

export type ReferralEventType =
  | "created"
  | "restored"
  | "refreshed"
  | "cleared"
  | "expired";
