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
  representativeChangePasswordFormDefaultValues,
  representativeChangePasswordFormSchema,
  type RepresentativeChangePasswordFormValues,
} from "@/features/representative/schemas/representativeChangePasswordFormSchema";
import { useChangeRepresentativePassword } from "@/hooks/api/useChangeRepresentativePassword";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";

type RepresentativeChangePasswordFormProps = {
  className?: string;
};

/**
 * Card de segurança — alteração de senha no perfil do representante.
 */
function RepresentativeChangePasswordForm({
  className,
}: RepresentativeChangePasswordFormProps) {
  const changePasswordMutation = useChangeRepresentativePassword();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RepresentativeChangePasswordFormValues>({
    resolver: zodResolver(representativeChangePasswordFormSchema),
    shouldFocusError: true,
    defaultValues: representativeChangePasswordFormDefaultValues,
  });

  const busy = isSubmitting || changePasswordMutation.isPending;
  const newPasswordValue = watch("newPassword") ?? "";

  const onSubmit = handleSubmit((values) => {
    changePasswordMutation.mutate(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      },
      {
        onSuccess: () => {
          reset(representativeChangePasswordFormDefaultValues);
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
            <Label htmlFor="rep-current-password">Senha atual</Label>
            <PasswordInput
              id="rep-current-password"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.currentPassword)}
              aria-describedby={
                errors.currentPassword
                  ? "rep-current-password-error"
                  : undefined
              }
              disabled={busy}
              {...register("currentPassword")}
            />
            {errors.currentPassword ? (
              <p
                id="rep-current-password-error"
                className="text-destructive text-xs"
                role="alert"
              >
                {errors.currentPassword.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="rep-new-password">Nova senha</Label>
            <PasswordInput
              id="rep-new-password"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.newPassword)}
              aria-describedby={
                errors.newPassword
                  ? "rep-new-password-error rep-new-password-requirements"
                  : "rep-new-password-requirements"
              }
              disabled={busy}
              {...register("newPassword")}
            />
            <PasswordRequirements
              id="rep-new-password-requirements"
              password={newPasswordValue}
            />
            {errors.newPassword ? (
              <p
                id="rep-new-password-error"
                className="text-destructive text-xs"
                role="alert"
              >
                {errors.newPassword.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="rep-confirm-password">Confirmar nova senha</Label>
            <PasswordInput
              id="rep-confirm-password"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={
                errors.confirmPassword
                  ? "rep-confirm-password-error"
                  : undefined
              }
              disabled={busy}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword ? (
              <p
                id="rep-confirm-password-error"
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

export { RepresentativeChangePasswordForm };
export type { RepresentativeChangePasswordFormProps };
