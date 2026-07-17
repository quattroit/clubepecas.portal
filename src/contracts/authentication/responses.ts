import type { UserRole } from "@/contracts/common/enums";

export type RegisterUserResponse = {
  userId: string;
  fullName: string;
  email: string;
  role: UserRole;
};

export type LoginResponse = {
  accessToken: string;
  expiresAt: string;
  userId: string;
  fullName: string;
  email: string;
  role: UserRole;
};

export type CurrentUserResponse = {
  id: string;
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
