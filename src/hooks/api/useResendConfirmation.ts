"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ResendConfirmationRequest } from "@/contracts/authentication/requests";
import { authenticationService } from "@/services/authentication.service";

export function useResendConfirmation() {
  return useMutation({
    mutationFn: (payload: ResendConfirmationRequest) =>
      authenticationService.resendConfirmation(payload),
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });
}
