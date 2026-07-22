import type {
  RepresentativeForgotPasswordRequest,
  RepresentativeForgotPasswordResponse,
  RepresentativeLoginRequest,
  RepresentativeLoginResponse,
  RepresentativeLogoutResponse,
  RepresentativeResetPasswordRequest,
  RepresentativeResetPasswordResponse,
} from "@/contracts/representative/auth";
import { api } from "@/lib/api";

/**
 * Autenticação do portal do representante comercial (Sprint 10.6).
 */
export const representativeAuthService = {
  login(payload: RepresentativeLoginRequest) {
    return api
      .post<RepresentativeLoginResponse>(
        "/api/v1/representative-auth/login",
        payload,
      )
      .then((response) => response.data);
  },

  forgotPassword(payload: RepresentativeForgotPasswordRequest) {
    return api
      .post<RepresentativeForgotPasswordResponse>(
        "/api/v1/representative-auth/forgot-password",
        payload,
      )
      .then((response) => response.data);
  },

  resetPassword(payload: RepresentativeResetPasswordRequest) {
    return api
      .post<RepresentativeResetPasswordResponse>(
        "/api/v1/representative-auth/reset-password",
        payload,
      )
      .then((response) => response.data);
  },

  logout() {
    return api
      .post<RepresentativeLogoutResponse>("/api/v1/representative-auth/logout")
      .then((response) => response.data);
  },
};
