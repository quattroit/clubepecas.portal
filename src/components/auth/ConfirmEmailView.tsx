"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { ResendConfirmationButton } from "@/components/auth/ResendConfirmationButton";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/constants/routes";
import { useConfirmEmail } from "@/hooks/api/useConfirmEmail";
import { getFriendlyErrorMessage, hasErrorCode } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";

const resendSchema = z.object({
  email: z.string().min(1, "Informe o e-mail").email("E-mail inválido"),
});

type ResendFormValues = z.infer<typeof resendSchema>;

function ConfirmEmailView() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const confirmMutation = useConfirmEmail();
  const startedRef = useRef(false);

  useEffect(() => {
    if (!token || startedRef.current) {
      return;
    }
    startedRef.current = true;
    confirmMutation.mutate({ token });
    // Intencional: dispara uma vez por token; o ref evita double-submit no Strict Mode.
  }, [token, confirmMutation.mutate]);

  if (!token) {
    return (
      <ConfirmEmailStatus
        title="Link inválido"
        description="Este link de confirmação está incompleto ou inválido."
        showResend
      />
    );
  }

  if (confirmMutation.isPending || (!confirmMutation.isError && !confirmMutation.isSuccess)) {
    return (
      <div className="flex w-full flex-col items-center gap-4 text-center">
        <Loader2 className="text-primary size-8 animate-spin" aria-hidden />
        <h1 className="text-h1">Confirmando e-mail</h1>
        <p className="text-small">Aguarde enquanto validamos o seu link.</p>
      </div>
    );
  }

  if (confirmMutation.isSuccess) {
    if (confirmMutation.data.alreadyConfirmed) {
      return (
        <ConfirmEmailStatus
          title="Este e-mail já foi confirmado"
          description="Sua conta já está ativa. Faça login para acessar o ClubePeças."
          loginLabel="Ir para o login"
        />
      );
    }

    return (
      <ConfirmEmailStatus
        title="E-mail confirmado com sucesso!"
        description="Sua conta está ativa. Entre no ClubePeças para continuar."
        loginLabel="Entrar no ClubePeças"
      />
    );
  }

  const expired = hasErrorCode(confirmMutation.error, "auth.confirm_token.expired");
  const used = hasErrorCode(confirmMutation.error, "auth.confirm_token.used");

  if (used) {
    return (
      <ConfirmEmailStatus
        title="Este e-mail já foi confirmado"
        description="Sua conta já está ativa. Faça login para acessar o ClubePeças."
        loginLabel="Ir para o login"
      />
    );
  }

  return (
    <ConfirmEmailStatus
      title={expired ? "Este link de confirmação expirou" : "Este link de confirmação é inválido"}
      description={getFriendlyErrorMessage(confirmMutation.error)}
      showResend
    />
  );
}

function ConfirmEmailStatus({
  title,
  description,
  loginLabel = "Ir para o login",
  showResend = false,
}: {
  title: string;
  description: string;
  loginLabel?: string;
  showResend?: boolean;
}) {
  const [emailToResend, setEmailToResend] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendFormValues>({
    resolver: zodResolver(resendSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit((values) => {
    setEmailToResend(values.email.trim());
  });

  return (
    <div className="flex w-full flex-col gap-5 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-h1">{title}</h1>
        <p className="text-small">{description}</p>
      </div>

      {showResend ? (
        emailToResend ? (
          <ResendConfirmationButton
            email={emailToResend}
            label="Reenviar e-mail de confirmação"
          />
        ) : (
          <form className="flex flex-col gap-4 text-left" onSubmit={onSubmit} noValidate>
            {errors.email ? (
              <ErrorMessage title="E-mail inválido" message={errors.email.message ?? ""} />
            ) : null}
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirm-resend-email">E-mail</Label>
              <Input
                id="confirm-resend-email"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />
            </div>
            <Button type="submit" variant="primary" className="w-full">
              Reenviar e-mail de confirmação
            </Button>
          </form>
        )
      ) : null}

      <Link
        href={ROUTES.LOGIN}
        className={cn(buttonVariants({ variant: showResend ? "outline" : "primary" }), "w-full")}
      >
        {loginLabel}
      </Link>
    </div>
  );
}

export { ConfirmEmailView };
