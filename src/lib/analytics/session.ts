import { hasAnalyticsConsent } from "@/lib/cookie-consent";

const SESSION_STORAGE_KEY = "cp_analytics_session_id";

/**
 * Identificador anônimo de sessão do navegador (localStorage).
 * Sem autenticação — apenas para correlacionar eventos.
 * Só é criado/lido com consentimento de analytics (LGPD).
 */
export function getAnalyticsSessionId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  if (!hasAnalyticsConsent()) {
    return "";
  }

  try {
    const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (existing && existing.length > 0) {
      return existing;
    }

    const created =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

    window.localStorage.setItem(SESSION_STORAGE_KEY, created);
    return created;
  } catch {
    return "";
  }
}

/** Remove o id de sessão quando o usuário revoga analytics. */
export function clearAnalyticsSessionId(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // Ignora.
  }
}
