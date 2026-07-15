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
};
