import {
  ReferralSettings,
  type ReferralEventType,
} from "@/config/referralSettings";
import type { PublicRepresentativeResponse } from "@/contracts/admin/representatives";
import { api } from "@/lib/api";

/**
 * Payload persistido (LocalStorage + Cookie).
 * Apenas código, datas e versão — sem dados sensíveis.
 */
export type ReferralStoragePayload = {
  version: number;
  representativeCode: string;
  capturedAt: string;
  expiresAt: string;
};

export type SaveReferralResult =
  | { status: "created"; payload: ReferralStoragePayload }
  | { status: "refreshed"; payload: ReferralStoragePayload }
  | {
      status: "blocked";
      payload: ReferralStoragePayload;
      pendingCode: string;
    };

export type LoadReferralResult = {
  payload: ReferralStoragePayload | null;
  auditEvent?: ReferralEventType;
};

function canUseBrowser(): boolean {
  return typeof window !== "undefined";
}

function canUseLocalStorage(): boolean {
  return canUseBrowser() && typeof window.localStorage !== "undefined";
}

function expirationMs(): number {
  return ReferralSettings.expirationDays * 24 * 60 * 60 * 1000;
}

function buildPayload(code: string, capturedAt?: string): ReferralStoragePayload {
  const now = Date.now();
  const captured = capturedAt ? Date.parse(capturedAt) : now;
  const capturedMs = Number.isNaN(captured) ? now : captured;
  return {
    version: ReferralSettings.structureVersion,
    representativeCode: code.trim().toUpperCase(),
    capturedAt: new Date(capturedMs).toISOString(),
    expiresAt: new Date(now + expirationMs()).toISOString(),
  };
}

function isExpired(payload: ReferralStoragePayload, now = Date.now()): boolean {
  const expiresMs = Date.parse(payload.expiresAt);
  if (Number.isNaN(expiresMs)) return true;
  return now >= expiresMs;
}

function parsePayload(raw: string | null | undefined): ReferralStoragePayload | null {
  if (!raw) return null;

  try {
    const trimmed = raw.trim();
    if (!trimmed.startsWith("{")) {
      const code = trimmed.toUpperCase();
      if (!code) return null;
      return buildPayload(code);
    }

    const parsed = JSON.parse(trimmed) as Partial<ReferralStoragePayload>;
    const code = parsed.representativeCode?.trim().toUpperCase();
    if (!code) return null;

    const capturedAt = parsed.capturedAt ?? new Date().toISOString();
    const expiresAt =
      parsed.expiresAt ??
      new Date(Date.parse(capturedAt) + expirationMs()).toISOString();

    return {
      version: parsed.version ?? ReferralSettings.structureVersion,
      representativeCode: code,
      capturedAt,
      expiresAt,
    };
  } catch {
    return null;
  }
}

function readCookieRaw(): string | null {
  if (!canUseBrowser()) return null;
  const name = `${ReferralSettings.cookieName}=`;
  for (const part of document.cookie.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(name)) {
      return decodeURIComponent(trimmed.slice(name.length));
    }
  }
  return null;
}

function writeCookie(payload: ReferralStoragePayload): void {
  if (!canUseBrowser()) return;

  const maxAge = Math.max(
    0,
    Math.floor((Date.parse(payload.expiresAt) - Date.now()) / 1000),
  );
  const secure =
    window.location.protocol === "https:" ? "; Secure" : "";

  const value = encodeURIComponent(JSON.stringify(payload));
  document.cookie =
    `${ReferralSettings.cookieName}=${value}` +
    `; Path=/; Max-Age=${maxAge}; SameSite=${ReferralSettings.cookieSameSite}${secure}`;
}

function clearCookie(): void {
  if (!canUseBrowser()) return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    `${ReferralSettings.cookieName}=` +
    `; Path=/; Max-Age=0; SameSite=${ReferralSettings.cookieSameSite}${secure}`;
}

function readLocalStorageRaw(): string | null {
  if (!canUseLocalStorage()) return null;
  return window.localStorage.getItem(ReferralSettings.localStorageKey);
}

function writeLocalStorage(payload: ReferralStoragePayload): void {
  if (!canUseLocalStorage()) return;
  window.localStorage.setItem(
    ReferralSettings.localStorageKey,
    JSON.stringify(payload),
  );
}

function clearLocalStorage(): void {
  if (!canUseLocalStorage()) return;
  window.localStorage.removeItem(ReferralSettings.localStorageKey);
}

function persistBoth(payload: ReferralStoragePayload): void {
  writeLocalStorage(payload);
  writeCookie(payload);
  notifyListeners();
}

type ReferralChangeListener = () => void;
const listeners = new Set<ReferralChangeListener>();

function notifyListeners(): void {
  listeners.forEach((listener) => listener());
}

/**
 * Serviço centralizado de indicação (Sprint 10.4).
 * Único responsável por Cookie + LocalStorage + API de restauração/auditoria.
 */
export const ReferralService = {
  buildPayload,

  subscribe(listener: ReferralChangeListener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  load(): LoadReferralResult {
    const fromLs = parsePayload(readLocalStorageRaw());
    const fromCookie = parsePayload(readCookieRaw());

    let source: ReferralStoragePayload | null = null;
    let restoredFromRedundancy = false;
    const hadBoth = Boolean(fromLs && fromCookie);

    if (fromLs && fromCookie) {
      const lsTime = Date.parse(fromLs.capturedAt) || 0;
      const cookieTime = Date.parse(fromCookie.capturedAt) || 0;

      if (fromLs.representativeCode !== fromCookie.representativeCode) {
        // Primeiro clique: manter o mais antigo
        source = lsTime <= cookieTime ? fromLs : fromCookie;
      } else {
        source = lsTime >= cookieTime ? fromLs : fromCookie;
      }
    } else if (fromLs) {
      source = fromLs;
      restoredFromRedundancy = !fromCookie;
    } else if (fromCookie) {
      source = fromCookie;
      restoredFromRedundancy = true;
    }

    if (!source) {
      return { payload: null };
    }

    if (isExpired(source)) {
      clearLocalStorage();
      clearCookie();
      return { payload: null, auditEvent: "expired" };
    }

    const refreshed = buildPayload(source.representativeCode, source.capturedAt);
    persistBoth(refreshed);

    // restored = veio de um lado só; refreshed = renovação remember-me
    const auditEvent = restoredFromRedundancy
      ? ("restored" as const)
      : hadBoth
        ? ("refreshed" as const)
        : ("restored" as const);

    return {
      payload: refreshed,
      auditEvent,
    };
  },

  save(code: string, options?: { force?: boolean }): SaveReferralResult {
    const normalized = code.trim().toUpperCase();
    const current = this.peek();

    if (
      current &&
      !options?.force &&
      current.representativeCode !== normalized
    ) {
      return {
        status: "blocked",
        payload: current,
        pendingCode: normalized,
      };
    }

    const existingSame =
      current?.representativeCode === normalized ? current : null;
    const payload = buildPayload(normalized, existingSame?.capturedAt);
    persistBoth(payload);

    return {
      status: existingSame ? "refreshed" : "created",
      payload,
    };
  },

  peek(): ReferralStoragePayload | null {
    const fromLs = parsePayload(readLocalStorageRaw());
    const fromCookie = parsePayload(readCookieRaw());
    const source = fromLs ?? fromCookie;
    if (!source) return null;
    if (isExpired(source)) {
      this.clear();
      return null;
    }
    if (!fromLs || !fromCookie) {
      persistBoth(source);
    }
    return source;
  },

  clear(): void {
    clearLocalStorage();
    clearCookie();
    notifyListeners();
  },

  getCurrentReferral(code: string) {
    return api
      .get<PublicRepresentativeResponse>(
        "/api/v1/representatives/current-referral",
        { params: { representativeCode: code.trim().toUpperCase() } },
      )
      .then((response) => response.data);
  },

  /** Fire-and-forget — não bloqueia a UI. */
  trackEvent(event: ReferralEventType, representativeCode?: string | null) {
    void api
      .post("/api/v1/representatives/referral-events", {
        event,
        representativeCode: representativeCode?.trim().toUpperCase() || undefined,
      })
      .catch(() => {
        /* auditoria não deve quebrar o fluxo */
      });
  },
};
