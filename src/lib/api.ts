import axios from "axios";
import { toast } from "sonner";

import { ROUTES } from "@/constants/routes";
import { buildLoginPathWithNext } from "@/lib/announce-flow";
import { clearAuthSession, getAccessToken } from "@/lib/auth/storage";
import {
  clearRepresentativeAuthSession,
  getRepresentativeAccessToken,
} from "@/lib/auth/representative-storage";
import { mapAxiosError, UnauthorizedError, isCanceledError } from "@/lib/errors";

/**
 * Cliente HTTP centralizado.
 * Anexa JWT quando disponível.
 * Em 401 autenticado: limpa sessão e redireciona para login.
 *
 * Sessão do representante (Sprint 10.6) é separada da sessão de
 * vendedor/admin — token e fluxo de expiração escolhidos pela rota atual.
 */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

/** `/representante` e subrotas usam a sessão própria do representante. */
function isRepresentativePathname(pathname: string): boolean {
  return (
    pathname === ROUTES.REPRESENTATIVE ||
    pathname.startsWith(`${ROUTES.REPRESENTATIVE}/`)
  );
}

function isRepresentativeAuthPathname(pathname: string): boolean {
  return (
    pathname.startsWith(ROUTES.REPRESENTATIVE_LOGIN) ||
    pathname.startsWith(ROUTES.REPRESENTATIVE_FORGOT_PASSWORD) ||
    pathname.startsWith(ROUTES.REPRESENTATIVE_RESET_PASSWORD)
  );
}

api.interceptors.request.use(
  (config) => {
    const useRepresentativeSession =
      typeof window !== "undefined" &&
      isRepresentativePathname(window.location.pathname);

    const token = useRepresentativeSession
      ? getRepresentativeAccessToken()
      : getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // FormData precisa do boundary automático do browser.
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      if (config.headers && "Content-Type" in config.headers) {
        delete config.headers["Content-Type"];
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isCanceledError(error)) {
      return Promise.reject(error);
    }

    const mapped = mapAxiosError(error);

    if (mapped instanceof UnauthorizedError && typeof window !== "undefined") {
      const path = window.location.pathname;

      if (isRepresentativePathname(path)) {
        const hadToken = Boolean(getRepresentativeAccessToken());

        if (hadToken) {
          clearRepresentativeAuthSession();
          toast.error("Sua sessão expirou. Faça login novamente.");

          if (!isRepresentativeAuthPathname(path)) {
            const currentPath = `${path}${window.location.search}`;
            window.location.assign(
              `${ROUTES.REPRESENTATIVE_LOGIN}?next=${encodeURIComponent(currentPath)}`,
            );
          }
        }
      } else {
        const hadToken = Boolean(getAccessToken());

        if (hadToken) {
          clearAuthSession();
          toast.error("Sua sessão expirou. Faça login novamente.");

          const isAuthPage =
            path.startsWith(ROUTES.LOGIN) ||
            path.startsWith(ROUTES.LOGIN_ADMIN) ||
            path.startsWith(ROUTES.REGISTER) ||
            path.startsWith(ROUTES.FORGOT_PASSWORD) ||
            path.startsWith(ROUTES.RESET_PASSWORD) ||
            path.startsWith(ROUTES.CONFIRM_EMAIL);

          if (!isAuthPage) {
            const currentPath = `${path}${window.location.search}`;
            window.location.assign(buildLoginPathWithNext(currentPath));
          }
        }
      }
    }

    return Promise.reject(mapped);
  },
);
