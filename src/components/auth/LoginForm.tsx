"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
import { useLogin } from "@/hooks/api/useLogin";
import { getSafeAuthNextPath } from "@/lib/announce-flow";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";

const loginSchema = z.object({
  email: z.string().min(1, "Informe o e-mail").email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const searchParams = useSearchParams();
  const nextPath = getSafeAuthNextPath(searchParams.get("next"));
  const registerHref = nextPath
    ? (`${ROUTES.REGISTER}?next=${encodeURIComponent(nextPath)}` as const)
    : ROUTES.REGISTER;

  const loginMutation = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
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
        <h1 className="text-h1">Entrar</h1>
        <p className="text-small">Acesse sua conta no ClubePeças.</p>
      </div>

      {loginMutation.isError ? (
        <ErrorMessage
          title="Falha no login"
          message={getFriendlyErrorMessage(loginMutation.error)}
        />
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="login-email">E-mail</Label>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "login-email-error" : undefined}
          disabled={isPending}
          {...register("email")}
        />
        {errors.email ? (
          <p
            id="login-email-error"
            className="text-destructive text-xs"
            role="alert"
          >
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="login-password">Senha</Label>
          <Link
            href={ROUTES.FORGOT_PASSWORD}
            className="text-primary text-xs font-medium underline-offset-4 hover:underline"
          >
            Esqueci minha senha
          </Link>
        </div>
        <PasswordInput
          id="login-password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={
            errors.password ? "login-password-error" : undefined
          }
          disabled={isPending}
          {...register("password")}
        />
        {errors.password ? (
          <p
            id="login-password-error"
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
          "Entrar"
        )}
      </Button>

      <p className="text-small text-center">
        Ainda não tem conta?{" "}
        <Link
          href={registerHref}
          className="text-primary font-medium underline-offset-4 hover:underline"
        >
          Cadastre-se
        </Link>
      </p>
    </form>
  );
}

export { LoginForm };
