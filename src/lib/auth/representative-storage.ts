import type { RepresentativeAuthSession } from "@/mappers/representative-authentication.mapper";

/** Chave separada da sessão de vendedor/admin — Sprint 10.6. */
const STORAGE_KEY = "clubepecas.representative.auth.session";
export const REPRESENTATIVE_AUTH_CHANGE_EVENT =
  "clubepecas-representative-auth-change";

/**
 * Cache do snapshot para useSyncExternalStore.
 * getSnapshot deve devolver a mesma referência enquanto o storage não muda.
 */
let cachedRaw: string | null | undefined;
let cachedSession: RepresentativeAuthSession | null = null;

function setSessionCache(
  raw: string | null,
  session: RepresentativeAuthSession | null,
) {
  cachedRaw = raw;
  cachedSession = session;
}

function notifyRepresentativeAuthChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(REPRESENTATIVE_AUTH_CHANGE_EVENT));
}

export function loadRepresentativeAuthSession(): RepresentativeAuthSession | null {
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

    const session = JSON.parse(raw) as RepresentativeAuthSession;
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

export function saveRepresentativeAuthSession(
  session: RepresentativeAuthSession,
): void {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(session);
  window.localStorage.setItem(STORAGE_KEY, raw);
  // Mantém a mesma referência da sessão salva no próximo getSnapshot
  setSessionCache(raw, session);
  notifyRepresentativeAuthChange();
}

export function clearRepresentativeAuthSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  setSessionCache(null, null);
  notifyRepresentativeAuthChange();
}

export function getRepresentativeAccessToken(): string | null {
  return loadRepresentativeAuthSession()?.accessToken ?? null;
}

export function subscribeRepresentativeAuthStorage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(REPRESENTATIVE_AUTH_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(REPRESENTATIVE_AUTH_CHANGE_EVENT, onStoreChange);
  };
}
