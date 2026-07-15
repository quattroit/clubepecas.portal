import type { AuthSession } from "@/mappers/authentication.mapper";

const STORAGE_KEY = "clubepecas.auth.session";
export const AUTH_CHANGE_EVENT = "clubepecas-auth-change";

/**
 * Cache do snapshot para useSyncExternalStore.
 * getSnapshot deve devolver a mesma referência enquanto o storage não muda.
 */
let cachedRaw: string | null | undefined;
let cachedSession: AuthSession | null = null;

function setSessionCache(raw: string | null, session: AuthSession | null) {
  cachedRaw = raw;
  cachedSession = session;
}

function notifyAuthChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function loadAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    // Referência estável: mesmo conteúdo → mesmo objeto
    if (raw === cachedRaw) {
      return cachedSession;
    }

    if (!raw) {
      setSessionCache(null, null);
      return null;
    }

    const session = JSON.parse(raw) as AuthSession;
    if (!session?.accessToken || !session?.expiresAt) {
      window.localStorage.removeItem(STORAGE_KEY);
      setSessionCache(null, null);
      return null;
    }

    if (new Date(session.expiresAt).getTime() <= Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY);
      setSessionCache(null, null);
      return null;
    }

    setSessionCache(raw, session);
    return session;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    setSessionCache(null, null);
    return null;
  }
}

export function saveAuthSession(session: AuthSession): void {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(session);
  window.localStorage.setItem(STORAGE_KEY, raw);
  // Mantém a mesma referência da sessão salva no próximo getSnapshot
  setSessionCache(raw, session);
  notifyAuthChange();
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  setSessionCache(null, null);
  notifyAuthChange();
}

export function getAccessToken(): string | null {
  return loadAuthSession()?.accessToken ?? null;
}

export function subscribeAuthStorage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(AUTH_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(AUTH_CHANGE_EVENT, onStoreChange);
  };
}
