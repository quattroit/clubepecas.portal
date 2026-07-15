import type { LoginResponse } from "@/contracts/authentication/responses";

export type AuthSession = {
  accessToken: string;
  expiresAt: string;
  userId: string;
  fullName: string;
  email: string;
  role: number;
};

export function mapLoginResponseToSession(dto: LoginResponse): AuthSession {
  return {
    accessToken: dto.accessToken,
    expiresAt: dto.expiresAt,
    userId: dto.userId,
    fullName: dto.fullName,
    email: dto.email,
    role: dto.role,
  };
}
