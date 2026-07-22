"use client";

import { useMutation } from "@tanstack/react-query";

import type { ValidateRepresentativeCodeRequest } from "@/contracts/admin/representatives";
import { representativesService } from "@/services/representatives.service";

export function useValidateRepresentativeCode() {
  return useMutation({
    mutationFn: (payload: ValidateRepresentativeCodeRequest) =>
      representativesService.validateCode(payload),
  });
}
