import type {
  ChangePasswordRequest,
  ConfirmEmailRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterUserRequest,
  ResendConfirmationRequest,
  ResetPasswordRequest,
} from "@/contracts/authentication/requests";
import type {
  ChangePasswordResponse,
  ConfirmEmailResponse,
  CurrentUserResponse,
  ForgotPasswordResponse,
  LoginResponse,
  RegisterUserResponse,
  ResendConfirmationResponse,
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

  confirmEmail(payload: ConfirmEmailRequest) {
    return api
      .post<ConfirmEmailResponse>("/api/v1/auth/confirm-email", payload)
      .then((response) => response.data);
  },

  resendConfirmation(payload: ResendConfirmationRequest) {
    return api
      .post<ResendConfirmationResponse>(
        "/api/v1/auth/resend-confirmation",
        payload,
      )
      .then((response) => response.data);
  },
};
