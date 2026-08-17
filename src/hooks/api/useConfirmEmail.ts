"use client";

import { useMutation } from "@tanstack/react-query";

import type { ConfirmEmailRequest } from "@/contracts/authentication/requests";
import { authenticationService } from "@/services/authentication.service";

export function useConfirmEmail() {
  return useMutation({
    mutationFn: (payload: ConfirmEmailRequest) =>
      authenticationService.confirmEmail(payload),
  });
}
