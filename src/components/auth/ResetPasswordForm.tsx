"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { PasswordRequirements } from "@/components/auth/PasswordRequirements";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { ROUTES } from "@/constants/routes";
import { useResetPassword } from "@/hooks/api/useResetPassword";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { passwordSchema } from "@/lib/auth/passwordPolicy";
import { cn } from "@/lib/utils";

const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Confirme a nova senha"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "A confirmação da senha não confere",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  const resetMutation = useResetPassword();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    shouldFocusError: true,
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const isPending = resetMutation.isPending;
  const hasToken = token.length > 0;
  const newPasswordValue = watch("newPassword") ?? "";

  const onSubmit = handleSubmit((values) => {
    if (isPending || !hasToken) return;
    resetMutation.mutate(
      {
        token,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      },
      {
        onSuccess: () => {
          router.replace(ROUTES.LOGIN);
        },
      },
    );
  });

  if (!hasToken) {
    return (
      <div className="flex w-full flex-col gap-5 text-center">
        <h1 className="text-h1">Link inválido</h1>
        <p className="text-small">
          Este link de redefinição está incompleto ou inválido.
        </p>
        <Link
          href={ROUTES.FORGOT_PASSWORD}
          className={cn(buttonVariants({ variant: "primary" }), "w-full")}
        >
          Solicitar novo link
        </Link>
        <p className="text-small">
          <Link
            href={ROUTES.LOGIN}
            className="text-primary font-medium underline-offset-4 hover:underline"
          >
            Voltar para o login
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full flex-col gap-5"
      noValidate
      aria-busy={isPending}
    >
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-h1">Redefinir senha</h1>
        <p className="text-small">Escolha uma nova senha para sua conta.</p>
      </div>

      {resetMutation.isError ? (
        <ErrorMessage
          title="Não foi possível redefinir"
          message={getFriendlyErrorMessage(resetMutation.error)}
        />
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="reset-new-password">Nova senha</Label>
        <PasswordInput
          id="reset-new-password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.newPassword)}
          aria-describedby={
            errors.newPassword
              ? "reset-new-password-error reset-password-requirements"
              : "reset-password-requirements"
          }
          disabled={isPending}
          {...register("newPassword")}
        />
        <PasswordRequirements
          id="reset-password-requirements"
          password={newPasswordValue}
        />
        {errors.newPassword ? (
          <p
            id="reset-new-password-error"
            className="text-destructive text-xs"
            role="alert"
          >
            {errors.newPassword.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="reset-confirm-password">Confirmar nova senha</Label>
        <PasswordInput
          id="reset-confirm-password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirmPassword)}
          aria-describedby={
            errors.confirmPassword
              ? "reset-confirm-password-error"
              : undefined
          }
          disabled={isPending}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword ? (
          <p
            id="reset-confirm-password-error"
            className="text-destructive text-xs"
            role="alert"
          >
            {errors.confirmPassword.message}
          </p>
        ) : null}
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={isPending}
        aria-busy={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Salvando…
          </>
        ) : (
          "Redefinir senha"
        )}
      </Button>

      <p className="text-small text-center">
        Link expirado?{" "}
        <Link
          href={ROUTES.FORGOT_PASSWORD}
          className="text-primary font-medium underline-offset-4 hover:underline"
        >
          Solicitar novo envio
        </Link>
      </p>
    </form>
  );
}

export { ResetPasswordForm };
