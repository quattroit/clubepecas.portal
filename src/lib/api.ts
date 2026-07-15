import axios from "axios";
import { toast } from "sonner";

import { ROUTES } from "@/constants/routes";
import { clearAuthSession, getAccessToken } from "@/lib/auth/storage";
import { mapAxiosError, UnauthorizedError } from "@/lib/errors";

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
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const mapped = mapAxiosError(error);
    const hadToken = Boolean(getAccessToken());

    if (mapped instanceof UnauthorizedError && hadToken) {
      clearAuthSession();

      if (typeof window !== "undefined") {
        toast.error("Sua sessão expirou. Faça login novamente.");
        const path = window.location.pathname;
        if (!path.startsWith(ROUTES.LOGIN) && !path.startsWith(ROUTES.REGISTER)) {
          window.location.assign(ROUTES.LOGIN);
        }
      }
    }

    return Promise.reject(mapped);
  },
);
