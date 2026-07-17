"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ForgotPasswordRequest } from "@/contracts/authentication/requests";
import { authenticationService } from "@/services/authentication.service";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordRequest) =>
      authenticationService.forgotPassword(payload),
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });
}
