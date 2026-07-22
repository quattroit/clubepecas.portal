"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { ValidateRepresentativeCodeResponse } from "@/contracts/admin/representatives";
import { isRepresentativeActive } from "@/contracts/admin/representatives";
import { useSeller } from "@/hooks/api/useSeller";
import {
  ReferralService,
  type ReferralStoragePayload,
  type SaveReferralResult,
} from "@/services/referral.service";

const BOOTSTRAP_AUDIT_KEY = "referral.bootstrap.audited";

function canMarkBootstrapAudit(): boolean {
  if (typeof sessionStorage === "undefined") return true;
  return sessionStorage.getItem(BOOTSTRAP_AUDIT_KEY) !== "1";
}

function markBootstrapAudit(): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(BOOTSTRAP_AUDIT_KEY, "1");
}

type ReferralPublicInfo = Pick<
  ValidateRepresentativeCodeResponse,
  "name" | "representativeCode" | "status" | "statusLabel"
>;

type ReferralContextValue = {
  /** Indica se a restauração inicial terminou. */
  isReady: boolean;
  isLoadingProfile: boolean;
  representativeCode: string | null;
  representativeName: string | null;
  status: ValidateRepresentativeCodeResponse["status"] | null;
  statusLabel: string | null;
  expiration: string | null;
  capturedAt: string | null;
  /** Código pendente bloqueado por indicação ativa (Trocar Indicação). */
  pendingCode: string | null;
  hasActiveReferral: boolean;
  save: (code: string, options?: { force?: boolean }) => Promise<SaveReferralResult>;
  load: () => Promise<void>;
  clear: (options?: { silent?: boolean }) => void;
  refresh: () => Promise<void>;
  validate: (code: string) => Promise<ReferralPublicInfo | null>;
  acceptPendingReplacement: () => Promise<void>;
  dismissPendingReplacement: () => void;
};

const ReferralContext = createContext<ReferralContextValue | null>(null);

type ReferralProviderProps = {
  children: ReactNode;
};

function ReferralProvider({ children }: ReferralProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [payload, setPayload] = useState<ReferralStoragePayload | null>(null);
  const [profile, setProfile] = useState<ReferralPublicInfo | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [pendingCode, setPendingCode] = useState<string | null>(null);
  const profileCacheRef = useRef<Map<string, ReferralPublicInfo>>(new Map());
  const auditedBootstrapRef = useRef(false);

  const sellerQuery = useSeller();
  const alreadyLinked = Boolean(sellerQuery.data?.representativeId);

  const fetchProfile = useCallback(async (code: string) => {
    const normalized = code.trim().toUpperCase();
    const cached = profileCacheRef.current.get(normalized);
    if (cached) {
      setProfile(cached);
      return cached;
    }

    setIsLoadingProfile(true);
    try {
      const data = await ReferralService.getCurrentReferral(normalized);
      profileCacheRef.current.set(normalized, data);
      setProfile(data);
      return data;
    } catch {
      setProfile(null);
      return null;
    } finally {
      setIsLoadingProfile(false);
    }
  }, []);

  const applyPayload = useCallback(
    async (
      next: ReferralStoragePayload | null,
      auditEvent?: "created" | "restored" | "refreshed" | "cleared" | "expired",
    ) => {
      setPayload(next);
      if (!next) {
        setProfile(null);
        if (auditEvent) {
          ReferralService.trackEvent(auditEvent);
        }
        return;
      }

      if (auditEvent) {
        ReferralService.trackEvent(auditEvent, next.representativeCode);
      }

      await fetchProfile(next.representativeCode);
    },
    [fetchProfile],
  );

  const bootstrap = useCallback(async () => {
    const result = ReferralService.load();

    // Audita restauração/renovação uma vez por aba (evita flood no Strict Mode / navegações)
    if (result.auditEvent && !auditedBootstrapRef.current && canMarkBootstrapAudit()) {
      auditedBootstrapRef.current = true;
      markBootstrapAudit();
      ReferralService.trackEvent(
        result.auditEvent,
        result.payload?.representativeCode,
      );
    }

    setPayload(result.payload);
    if (result.payload) {
      await fetchProfile(result.payload.representativeCode);
    } else {
      setProfile(null);
      if (result.auditEvent === "expired" && !auditedBootstrapRef.current) {
        auditedBootstrapRef.current = true;
        ReferralService.trackEvent("expired");
      }
    }
    setIsReady(true);
  }, [fetchProfile]);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  // Sincroniza estado quando outro módulo limpa/grava via ReferralService
  useEffect(() => {
    return ReferralService.subscribe(() => {
      const next = ReferralService.peek();
      setPayload(next);
      if (!next) {
        setProfile(null);
        setPendingCode(null);
      }
    });
  }, []);

  // Limpeza automática após vínculo definitivo (Sprint 10.2)
  useEffect(() => {
    if (!sellerQuery.isSuccess) return;
    if (!alreadyLinked) return;
    if (!payload) return;

    ReferralService.clear();
    ReferralService.trackEvent("cleared", payload.representativeCode);
    setPayload(null);
    setProfile(null);
    setPendingCode(null);
  }, [alreadyLinked, payload, sellerQuery.isSuccess]);

  const save = useCallback(
    async (code: string, options?: { force?: boolean }) => {
      const result = ReferralService.save(code, options);

      if (result.status === "blocked") {
        setPendingCode(result.pendingCode);
        return result;
      }

      setPendingCode(null);
      await applyPayload(
        result.payload,
        result.status === "created" ? "created" : "refreshed",
      );
      return result;
    },
    [applyPayload],
  );

  const clear = useCallback(
    (options?: { silent?: boolean }) => {
      const code = payload?.representativeCode;
      ReferralService.clear();
      setPayload(null);
      setProfile(null);
      setPendingCode(null);
      if (!options?.silent) {
        ReferralService.trackEvent("cleared", code);
      }
    },
    [payload?.representativeCode],
  );

  const load = useCallback(async () => {
    const result = ReferralService.load();
    await applyPayload(result.payload, result.auditEvent);
  }, [applyPayload]);

  const refresh = useCallback(async () => {
    if (!payload) return;
    const result = ReferralService.save(payload.representativeCode, {
      force: true,
    });
    if (result.status === "blocked") return;
    await applyPayload(result.payload, "refreshed");
  }, [applyPayload, payload]);

  const validate = useCallback(
    async (code: string) => {
      const data = await fetchProfile(code);
      if (!data) return null;
      if (!isRepresentativeActive(data.status)) return data;
      return data;
    },
    [fetchProfile],
  );

  const acceptPendingReplacement = useCallback(async () => {
    if (!pendingCode) return;
    await save(pendingCode, { force: true });
  }, [pendingCode, save]);

  const dismissPendingReplacement = useCallback(() => {
    setPendingCode(null);
  }, []);

  const value = useMemo<ReferralContextValue>(
    () => ({
      isReady,
      isLoadingProfile,
      representativeCode: payload?.representativeCode ?? null,
      representativeName: profile?.name ?? null,
      status: profile?.status ?? null,
      statusLabel: profile?.statusLabel ?? null,
      expiration: payload?.expiresAt ?? null,
      capturedAt: payload?.capturedAt ?? null,
      pendingCode,
      hasActiveReferral: Boolean(payload?.representativeCode),
      save,
      load,
      clear,
      refresh,
      validate,
      acceptPendingReplacement,
      dismissPendingReplacement,
    }),
    [
      isReady,
      isLoadingProfile,
      payload,
      profile,
      pendingCode,
      save,
      load,
      clear,
      refresh,
      validate,
      acceptPendingReplacement,
      dismissPendingReplacement,
    ],
  );

  return (
    <ReferralContext.Provider value={value}>{children}</ReferralContext.Provider>
  );
}

function useReferral(): ReferralContextValue {
  const ctx = useContext(ReferralContext);
  if (!ctx) {
    throw new Error("useReferral must be used within ReferralProvider");
  }
  return ctx;
}

export { ReferralProvider, useReferral };
