"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import type { RepresentativeAuthSession } from "@/mappers/representative-authentication.mapper";
import {
  clearRepresentativeAuthSession,
  loadRepresentativeAuthSession,
  saveRepresentativeAuthSession,
  subscribeRepresentativeAuthStorage,
} from "@/lib/auth/representative-storage";

type RepresentativeAuthUser = {
  representativeId: number;
  fullName: string;
  email: string;
  representativeCode: string;
  role: number;
};

type RepresentativeAuthContextValue = {
  representative: RepresentativeAuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingOut: boolean;
  login: (session: RepresentativeAuthSession) => void;
  logout: () => void;
};

const RepresentativeAuthContext =
  createContext<RepresentativeAuthContextValue | null>(null);

function sessionToUser(
  session: RepresentativeAuthSession,
): RepresentativeAuthUser {
  return {
    representativeId: session.representativeId,
    fullName: session.fullName,
    email: session.email,
    representativeCode: session.representativeCode,
    role: session.role,
  };
}

type RepresentativeAuthProviderProps = {
  children: React.ReactNode;
};

/**
 * Sessão do portal do representante — separada da sessão de vendedor/admin.
 * Mesma estratégia de `AuthProvider` (localStorage + useSyncExternalStore).
 */
function RepresentativeAuthProvider({
  children,
}: RepresentativeAuthProviderProps) {
  const session = useSyncExternalStore(
    subscribeRepresentativeAuthStorage,
    loadRepresentativeAuthSession,
    () => null,
  );
  /** false no SSR / 1º paint; true no cliente após hidratar o store externo. */
  const hasHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const login = useCallback((nextSession: RepresentativeAuthSession) => {
    saveRepresentativeAuthSession(nextSession);
  }, []);

  const logout = useCallback(() => {
    setIsLoggingOut(true);
    clearRepresentativeAuthSession();
    setIsLoggingOut(false);
  }, []);

  const value = useMemo<RepresentativeAuthContextValue>(
    () => ({
      representative: session ? sessionToUser(session) : null,
      accessToken: session?.accessToken ?? null,
      isAuthenticated: Boolean(session),
      isLoading: !hasHydrated,
      isLoggingOut,
      login,
      logout,
    }),
    [session, hasHydrated, isLoggingOut, login, logout],
  );

  return (
    <RepresentativeAuthContext.Provider value={value}>
      {children}
    </RepresentativeAuthContext.Provider>
  );
}

function useRepresentativeAuth(): RepresentativeAuthContextValue {
  const context = useContext(RepresentativeAuthContext);
  if (!context) {
    throw new Error(
      "useRepresentativeAuth deve ser usado dentro de RepresentativeAuthProvider",
    );
  }
  return context;
}

export { RepresentativeAuthProvider, useRepresentativeAuth };
export type { RepresentativeAuthUser };
