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
import { PasswordInput } from "@/components/ui/password-input";
import { ROUTES } from "@/constants/routes";
import { useRepresentativeLogin } from "@/hooks/api/useRepresentativeLogin";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";

const representativeLoginSchema = z.object({
  email: z.string().min(1, "Informe o e-mail").email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
  rememberMe: z.boolean(),
});

type RepresentativeLoginFormValues = z.infer<typeof representativeLoginSchema>;

function RepresentativeLoginForm() {
  const loginMutation = useRepresentativeLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RepresentativeLoginFormValues>({
    resolver: zodResolver(representativeLoginSchema),
    shouldFocusError: true,
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const isPending = loginMutation.isPending;

  const onSubmit = handleSubmit((values) => {
    if (isPending) return;
    loginMutation.mutate({
      email: values.email,
      password: values.password,
      rememberMe: values.rememberMe,
    });
  });

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full flex-col gap-5"
      noValidate
      aria-busy={isPending}
    >
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-h1">Portal do Representante</h1>
        <p className="text-small">Acesse sua conta de representante comercial.</p>
      </div>

      {loginMutation.isError ? (
        <ErrorMessage
          title="Falha no login"
          message={getFriendlyErrorMessage(loginMutation.error)}
        />
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="representative-login-email">E-mail</Label>
        <Input
          id="representative-login-email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={
            errors.email ? "representative-login-email-error" : undefined
          }
          disabled={isPending}
          {...register("email")}
        />
        {errors.email ? (
          <p
            id="representative-login-email-error"
            className="text-destructive text-xs"
            role="alert"
          >
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="representative-login-password">Senha</Label>
          <Link
            href={ROUTES.REPRESENTATIVE_FORGOT_PASSWORD}
            className="text-primary text-xs font-medium underline-offset-4 hover:underline"
          >
            Esqueci minha senha
          </Link>
        </div>
        <PasswordInput
          id="representative-login-password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={
            errors.password ? "representative-login-password-error" : undefined
          }
          disabled={isPending}
          {...register("password")}
        />
        {errors.password ? (
          <p
            id="representative-login-password-error"
            className="text-destructive text-xs"
            role="alert"
          >
            {errors.password.message}
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="representative-login-remember"
          type="checkbox"
          disabled={isPending}
          className="border-input size-4 rounded border accent-[var(--primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          {...register("rememberMe")}
        />
        <Label
          htmlFor="representative-login-remember"
          className="font-normal"
        >
          Lembrar acesso
        </Label>
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
          "Entrar"
        )}
      </Button>
    </form>
  );
}

export { RepresentativeLoginForm };
