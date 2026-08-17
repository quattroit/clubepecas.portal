"use client";

import { Loader2 } from "lucide-react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { Button } from "@/components/ui/button";
import { useResendConfirmation } from "@/hooks/api/useResendConfirmation";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";

function ResendConfirmationButton({
  email,
  label = "Reenviar e-mail",
}: {
  email: string;
  label?: string;
}) {
  const resendMutation = useResendConfirmation();
  const trimmedEmail = email.trim();
  const canResend = trimmedEmail.length > 0 && !resendMutation.isPending;

  return (
    <div className="flex flex-col gap-3">
      {resendMutation.isError ? (
        <ErrorMessage
          title="Não foi possível reenviar"
          message={getFriendlyErrorMessage(resendMutation.error)}
        />
      ) : null}

      {resendMutation.isSuccess ? (
        <div
          role="status"
          className="border-border bg-secondary text-secondary-foreground rounded-lg border px-4 py-3"
        >
          <p className="text-small">{resendMutation.data.message}</p>
        </div>
      ) : null}

      <Button
        type="button"
        variant="primary"
        className="w-full"
        disabled={!canResend || resendMutation.isSuccess}
        aria-busy={resendMutation.isPending}
        onClick={() => {
          if (!canResend) return;
          resendMutation.mutate({ email: trimmedEmail });
        }}
      >
        {resendMutation.isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Reenviando…
          </>
        ) : (
          label
        )}
      </Button>
    </div>
  );
}

export { ResendConfirmationButton };
