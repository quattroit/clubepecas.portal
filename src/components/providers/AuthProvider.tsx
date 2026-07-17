"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import type { AuthSession } from "@/mappers/authentication.mapper";
import {
  clearAuthSession,
  loadAuthSession,
  saveAuthSession,
  subscribeAuthStorage,
} from "@/lib/auth/storage";

type AuthUser = {
  userId: string;
  fullName: string;
  email: string;
  role: number;
};

type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingOut: boolean;
  login: (session: AuthSession) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function sessionToUser(session: AuthSession): AuthUser {
  return {
    userId: session.userId,
    fullName: session.fullName,
    email: session.email,
    role: session.role,
  };
}

type AuthProviderProps = {
  children: React.ReactNode;
};

/**
 * Sessão em localStorage via useSyncExternalStore.
 * isLoading fica true até a hidratação no cliente — evita o AuthGuard
 * redirecionar para /login no Ctrl+F5 antes de ler o storage.
 */
function AuthProvider({ children }: AuthProviderProps) {
  const session = useSyncExternalStore(
    subscribeAuthStorage,
    loadAuthSession,
    () => null,
  );
  /** false no SSR / 1º paint; true no cliente após hidratar o store externo. */
  const hasHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const login = useCallback((nextSession: AuthSession) => {
    saveAuthSession(nextSession);
  }, []);

  const logout = useCallback(() => {
    setIsLoggingOut(true);
    clearAuthSession();
    setIsLoggingOut(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session ? sessionToUser(session) : null,
      accessToken: session?.accessToken ?? null,
      isAuthenticated: Boolean(session),
      isLoading: !hasHydrated,
      isLoggingOut,
      login,
      logout,
    }),
    [session, hasHydrated, isLoggingOut, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
export type { AuthUser };
