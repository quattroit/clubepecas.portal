"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/constants/routes";
import { useForgotPassword } from "@/hooks/api/useForgotPassword";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Informe o e-mail").email("E-mail inválido"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

function ForgotPasswordForm() {
  const forgotMutation = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    shouldFocusError: true,
    defaultValues: { email: "" },
  });

  const isPending = forgotMutation.isPending;
  const successMessage = forgotMutation.isSuccess
    ? forgotMutation.data.message
    : null;

  const onSubmit = handleSubmit((values) => {
    if (isPending) return;
    forgotMutation.mutate({ email: values.email.trim() });
  });

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full flex-col gap-5"
      noValidate
      aria-busy={isPending}
    >
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-h1">Esqueci minha senha</h1>
        <p className="text-small">
          Informe o e-mail da sua conta. Se existir cadastro, enviaremos as
          instruções para redefinir a senha.
        </p>
      </div>

      {forgotMutation.isError ? (
        <ErrorMessage
          title="Não foi possível enviar"
          message={getFriendlyErrorMessage(forgotMutation.error)}
        />
      ) : null}

      {successMessage ? (
        <div
          role="status"
          className="border-border bg-secondary text-secondary-foreground rounded-lg border px-4 py-3"
        >
          <p className="text-small">{successMessage}</p>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="forgot-email">E-mail</Label>
        <Input
          id="forgot-email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "forgot-email-error" : undefined}
          disabled={isPending || forgotMutation.isSuccess}
          {...register("email")}
        />
        {errors.email ? (
          <p
            id="forgot-email-error"
            className="text-destructive text-xs"
            role="alert"
          >
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={isPending || forgotMutation.isSuccess}
        aria-busy={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Enviando…
          </>
        ) : (
          "Enviar instruções"
        )}
      </Button>

      <p className="text-small text-center">
        <Link
          href={ROUTES.LOGIN}
          className="text-primary font-medium underline-offset-4 hover:underline"
        >
          Voltar para o login
        </Link>
      </p>
    </form>
  );
}

export { ForgotPasswordForm };
