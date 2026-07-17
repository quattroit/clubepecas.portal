"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { useAdminLogin } from "@/hooks/api/useAdminLogin";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";

const adminLoginSchema = z.object({
  email: z.string().min(1, "Informe o e-mail").email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

function AdminLoginForm() {
  const loginMutation = useAdminLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    shouldFocusError: true,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isPending = loginMutation.isPending;

  const onSubmit = handleSubmit((values) => {
    if (isPending) return;
    loginMutation.mutate(values);
  });

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full flex-col gap-5"
      noValidate
      aria-busy={isPending}
    >
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-h1">Acesso administrativo</h1>
        <p className="text-small">
          Entre com uma conta de administrador do ClubePeças.
        </p>
      </div>

      {loginMutation.isError ? (
        <ErrorMessage
          title="Acesso negado"
          message={getFriendlyErrorMessage(loginMutation.error)}
        />
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="admin-login-email">E-mail</Label>
        <Input
          id="admin-login-email"
          type="email"
          autoComplete="username"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={
            errors.email ? "admin-login-email-error" : undefined
          }
          disabled={isPending}
          {...register("email")}
        />
        {errors.email ? (
          <p
            id="admin-login-email-error"
            className="text-destructive text-xs"
            role="alert"
          >
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="admin-login-password">Senha</Label>
        <PasswordInput
          id="admin-login-password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={
            errors.password ? "admin-login-password-error" : undefined
          }
          disabled={isPending}
          {...register("password")}
        />
        {errors.password ? (
          <p
            id="admin-login-password-error"
            className="text-destructive text-xs"
            role="alert"
          >
            {errors.password.message}
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
            Entrando…
          </>
        ) : (
          "Entrar no painel"
        )}
      </Button>
    </form>
  );
}

export { AdminLoginForm };
