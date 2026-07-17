import axios from "axios";
import { toast } from "sonner";

import { ROUTES } from "@/constants/routes";
import { buildLoginPathWithNext } from "@/lib/announce-flow";
import { clearAuthSession, getAccessToken } from "@/lib/auth/storage";
import { mapAxiosError, UnauthorizedError, isCanceledError } from "@/lib/errors";

/**
 * Cliente HTTP centralizado.
 * Anexa JWT quando disponível.
 * Em 401 autenticado: limpa sessão e redireciona para login.
 */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
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
    const hadToken = Boolean(getAccessToken());

    if (mapped instanceof UnauthorizedError && hadToken) {
      clearAuthSession();

      if (typeof window !== "undefined") {
        toast.error("Sua sessão expirou. Faça login novamente.");
        const path = window.location.pathname;
        const isAuthPage =
          path.startsWith(ROUTES.LOGIN) ||
          path.startsWith(ROUTES.LOGIN_ADMIN) ||
          path.startsWith(ROUTES.REGISTER) ||
          path.startsWith(ROUTES.FORGOT_PASSWORD) ||
          path.startsWith(ROUTES.RESET_PASSWORD);

        if (!isAuthPage) {
          const currentPath = `${path}${window.location.search}`;
          window.location.assign(buildLoginPathWithNext(currentPath));
        }
      }
    }

    return Promise.reject(mapped);
  },
);
