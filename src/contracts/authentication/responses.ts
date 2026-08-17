import type { UserRole } from "@/contracts/common/enums";

export type RegisterUserResponse = {
  userId: number;
  fullName: string;
  email: string;
  role: UserRole;
};

export type LoginResponse = {
  accessToken: string;
  expiresAt: string;
  userId: number;
  fullName: string;
  email: string;
  role: UserRole;
};

export type CurrentUserResponse = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  document?: string | null;
  personType?: number | null;
};

export type ChangePasswordResponse = {
  success: boolean;
};

export type ForgotPasswordResponse = {
  message: string;
};

export type ResetPasswordResponse = {
  success: boolean;
};

export type ConfirmEmailResponse = {
  success: boolean;
  alreadyConfirmed: boolean;
};

export type ResendConfirmationResponse = {
  message: string;
};
