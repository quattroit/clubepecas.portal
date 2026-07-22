"use client";

import { useMutation } from "@tanstack/react-query";

import type { RepresentativeForgotPasswordRequest } from "@/contracts/representative/auth";
import { representativeAuthService } from "@/services/representative-auth.service";

export function useRepresentativeForgotPassword() {
  return useMutation({
    mutationFn: (payload: RepresentativeForgotPasswordRequest) =>
      representativeAuthService.forgotPassword(payload),
  });
}
