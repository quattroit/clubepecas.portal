import type { UserRole } from "@/contracts/common/enums";

export type RegisterUserRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string | null;
  userRole: UserRole;
};

export type LoginRequest = {
  email: string;
  password: string;
};
