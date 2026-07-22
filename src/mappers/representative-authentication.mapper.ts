import { UserRole } from "@/contracts/common/enums";
import type { RepresentativeLoginResponse } from "@/contracts/representative/auth";

export type RepresentativeAuthSession = {
  accessToken: string;
  expiresAt: string;
  representativeId: number;
  fullName: string;
  email: string;
  representativeCode: string;
  /** Sempre UserRole.Representative — o backend não retorna role no login. */
  role: number;
};

export function mapRepresentativeLoginResponseToSession(
  dto: RepresentativeLoginResponse,
): RepresentativeAuthSession {
  return {
    accessToken: dto.accessToken,
    expiresAt: dto.expiresAt,
    representativeId: dto.representativeId,
    fullName: dto.name,
    email: dto.email,
    representativeCode: dto.representativeCode,
    role: UserRole.Representative,
  };
}
