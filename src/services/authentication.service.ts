import type {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterUserRequest,
  ResetPasswordRequest,
} from "@/contracts/authentication/requests";
import type {
  ChangePasswordResponse,
  CurrentUserResponse,
  ForgotPasswordResponse,
  LoginResponse,
  RegisterUserResponse,
  ResetPasswordResponse,
} from "@/contracts/authentication/responses";
import { api } from "@/lib/api";

/**
 * Serviços de autenticação.
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

  adminLogin(payload: LoginRequest) {
    return api
      .post<LoginResponse>("/api/v1/auth/admin/login", payload)
      .then((response) => response.data);
  },

  me() {
    return api
      .get<CurrentUserResponse>("/api/v1/auth/me")
      .then((response) => response.data);
  },

  changePassword(payload: ChangePasswordRequest) {
    return api
      .put<ChangePasswordResponse>("/api/v1/auth/me/password", payload)
      .then((response) => response.data);
  },

  forgotPassword(payload: ForgotPasswordRequest) {
    return api
      .post<ForgotPasswordResponse>("/api/v1/auth/forgot-password", payload)
      .then((response) => response.data);
  },

  resetPassword(payload: ResetPasswordRequest) {
    return api
      .post<ResetPasswordResponse>("/api/v1/auth/reset-password", payload)
      .then((response) => response.data);
  },
};
