"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { PasswordRequirements } from "@/components/auth/PasswordRequirements";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import {
  changePasswordFormDefaultValues,
  changePasswordFormSchema,
  type ChangePasswordFormValues,
} from "@/features/dashboard/schemas/changePasswordFormSchema";
import { useChangePassword } from "@/hooks/api/useChangePassword";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";

type ChangePasswordFormProps = {
  className?: string;
};

/**
 * Card de segurança — alteração de senha no perfil do vendedor.
 */
function ChangePasswordForm({ className }: ChangePasswordFormProps) {
  const changePasswordMutation = useChangePassword();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    shouldFocusError: true,
    defaultValues: changePasswordFormDefaultValues,
  });

  const busy = isSubmitting || changePasswordMutation.isPending;
  const newPasswordValue = watch("newPassword") ?? "";

  const onSubmit = handleSubmit((values) => {
    changePasswordMutation.mutate(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      },
      {
        onSuccess: () => {
          reset(changePasswordFormDefaultValues);
          changePasswordMutation.reset();
        },
      },
    );
  });

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader>
        <CardTitle className="text-h3">Segurança</CardTitle>
        <p className="text-small text-muted-foreground">
          Altere sua senha de acesso. Você precisará da senha atual.
        </p>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-4"
          onSubmit={onSubmit}
          noValidate
          aria-busy={busy}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="current-password">Senha atual</Label>
            <PasswordInput
              id="current-password"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.currentPassword)}
              aria-describedby={
                errors.currentPassword
                  ? "current-password-error"
                  : undefined
              }
              disabled={busy}
              {...register("currentPassword")}
            />
            {errors.currentPassword ? (
              <p
                id="current-password-error"
                className="text-destructive text-xs"
                role="alert"
              >
                {errors.currentPassword.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="new-password">Nova senha</Label>
            <PasswordInput
              id="new-password"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.newPassword)}
              aria-describedby={
                errors.newPassword
                  ? "new-password-error new-password-requirements"
                  : "new-password-requirements"
              }
              disabled={busy}
              {...register("newPassword")}
            />
            <PasswordRequirements
              id="new-password-requirements"
              password={newPasswordValue}
            />
            {errors.newPassword ? (
              <p
                id="new-password-error"
                className="text-destructive text-xs"
                role="alert"
              >
                {errors.newPassword.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="confirm-password">Confirmar nova senha</Label>
            <PasswordInput
              id="confirm-password"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={
                errors.confirmPassword
                  ? "confirm-password-error"
                  : undefined
              }
              disabled={busy}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword ? (
              <p
                id="confirm-password-error"
                className="text-destructive text-xs"
                role="alert"
              >
                {errors.confirmPassword.message}
              </p>
            ) : null}
          </div>

          {changePasswordMutation.isError ? (
            <ErrorMessage
              title="Não foi possível alterar a senha"
              message={getFriendlyErrorMessage(changePasswordMutation.error)}
            />
          ) : null}

          <Button
            type="submit"
            variant="primary"
            className="w-fit"
            disabled={busy}
            aria-busy={busy}
          >
            {busy ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Alterando…
              </>
            ) : (
              "Alterar senha"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export { ChangePasswordForm };
export type { ChangePasswordFormProps };
