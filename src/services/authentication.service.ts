import type {
  LoginRequest,
  RegisterUserRequest,
} from "@/contracts/authentication/requests";
import type {
  CurrentUserResponse,
  LoginResponse,
  RegisterUserResponse,
} from "@/contracts/authentication/responses";
import { api } from "@/lib/api";

/**
 * Serviços de autenticação — ainda não utilizados pelas páginas.
 */
export const authenticationService = {
  register(payload: RegisterUserRequest) {
    return api
      .post<RegisterUserResponse>("/api/v1/auth/register", payload)
      .then((response) => response.data);
  },

  login(payload: LoginRequest) {
    return api
      .post<LoginResponse>("/api/v1/auth/login", payload)
      .then((response) => response.data);
  },

  me() {
    return api
      .get<CurrentUserResponse>("/api/v1/auth/me")
      .then((response) => response.data);
  },
};
