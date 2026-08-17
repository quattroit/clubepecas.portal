"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { PasswordRequirements } from "@/components/auth/PasswordRequirements";
import { RegisterRepresentativeReferralSection } from "@/components/auth/RegisterRepresentativeReferralSection";
import { ResendConfirmationButton } from "@/components/auth/ResendConfirmationButton";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { ROUTES } from "@/constants/routes";
import { useRegister } from "@/hooks/api/useRegister";
import { getSafeAuthNextPath } from "@/lib/announce-flow";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { passwordSchema } from "@/lib/auth/passwordPolicy";
import { cn } from "@/lib/utils";
import {
  formatDocumentAuto,
  isValidDocumentAuto,
  onlyDigits,
} from "@/utils/document";

const registerSchema = z.object({
  firstName: z.string().min(1, "Informe o nome"),
  lastName: z.string().min(1, "Informe o sobrenome"),
  email: z.string().min(1, "Informe o e-mail").email("E-mail inválido"),
  password: passwordSchema,
  phoneNumber: z
    .string()
    .trim()
    .min(1, "Informe o telefone")
    .refine(
      (value) => value.replace(/\D/g, "").length >= 8,
      "Informe um telefone válido com DDD",
    ),
  document: z
    .string()
    .trim()
    .min(1, "Informe o CPF ou CNPJ")
    .refine(isValidDocumentAuto, "Informe um CPF ou CNPJ válido"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

function RegisterForm() {
  const searchParams = useSearchParams();
  const nextPath = getSafeAuthNextPath(searchParams.get("next"));
  const loginHref = nextPath
    ? (`${ROUTES.LOGIN}?next=${encodeURIComponent(nextPath)}` as const)
    : ROUTES.LOGIN;

  const registerMutation = useRegister();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    shouldFocusError: true,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      document: "",
    },
  });

  const isPending = registerMutation.isPending;
  const passwordValue = watch("password") ?? "";
  const registeredEmail =
    registerMutation.variables?.email.trim() ??
    registerMutation.data?.email ??
    "";

  const onSubmit = handleSubmit((values) => {
    if (isPending) return;
    registerMutation.mutate({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      phoneNumber: values.phoneNumber.trim(),
      document: onlyDigits(values.document),
    });
  });

  if (registerMutation.isSuccess) {
    return (
      <div className="flex w-full flex-col gap-5 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-h1">Cadastro realizado!</h1>
          <p className="text-small">Enviamos um e-mail para:</p>
        </div>
        <div
          role="status"
          className="border-border bg-secondary text-secondary-foreground rounded-lg border px-4 py-3"
        >
          <p className="text-small font-medium">{registeredEmail}</p>
        </div>
        <p className="text-small">
          Acesse sua caixa de entrada e clique no link para confirmar seu
          e-mail. Depois da confirmação, você poderá acessar o ClubePeças.
        </p>
        <ResendConfirmationButton
          email={registeredEmail}
          label="Reenviar e-mail"
        />
        <Link
          href={loginHref}
          className={cn(buttonVariants({ variant: "outline" }), "w-full")}
        >
          Voltar para o login
        </Link>
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
        <h1 className="text-h1">Criar conta de vendedor</h1>
        <p className="text-small">
          Cadastre-se para anunciar peças no ClubePeças. Visitantes navegam e
          entram em contato sem precisar de conta.
        </p>
      </div>

      {registerMutation.isError ? (
        <ErrorMessage
          title="Falha no cadastro"
          message={getFriendlyErrorMessage(registerMutation.error)}
        />
      ) : null}

      <RegisterRepresentativeReferralSection />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="register-first-name">Nome</Label>
          <Input
            id="register-first-name"
            autoComplete="given-name"
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={
              errors.firstName ? "register-first-name-error" : undefined
            }
            disabled={isPending}
            {...register("firstName")}
          />
          {errors.firstName ? (
            <p
              id="register-first-name-error"
              className="text-destructive text-xs"
              role="alert"
            >
              {errors.firstName.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="register-last-name">Sobrenome</Label>
          <Input
            id="register-last-name"
            autoComplete="family-name"
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby={
              errors.lastName ? "register-last-name-error" : undefined
            }
            disabled={isPending}
            {...register("lastName")}
          />
          {errors.lastName ? (
            <p
              id="register-last-name-error"
              className="text-destructive text-xs"
              role="alert"
            >
              {errors.lastName.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="register-document">CPF/CNPJ</Label>
        <Controller
          name="document"
          control={control}
          render={({ field }) => (
            <Input
              id="register-document"
              inputMode="numeric"
              autoComplete="off"
              placeholder="000.000.000-00 ou 00.000.000/0000-00"
              aria-invalid={Boolean(errors.document)}
              aria-describedby={
                errors.document
                  ? "register-document-error"
                  : "register-document-hint"
              }
              disabled={isPending}
              value={field.value}
              onChange={(event) =>
                field.onChange(formatDocumentAuto(event.target.value))
              }
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            />
          )}
        />
        <p id="register-document-hint" className="text-muted-foreground text-xs">
          Obrigatório. Usado para identificar seu cadastro de vendedor.
        </p>
        {errors.document ? (
          <p
            id="register-document-error"
            className="text-destructive text-xs"
            role="alert"
          >
            {errors.document.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="register-email">E-mail</Label>
        <Input
          id="register-email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={
            errors.email ? "register-email-error" : undefined
          }
          disabled={isPending}
          {...register("email")}
        />
        {errors.email ? (
          <p
            id="register-email-error"
            className="text-destructive text-xs"
            role="alert"
          >
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="register-password">Senha</Label>
        <PasswordInput
          id="register-password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={
            errors.password
              ? "register-password-error register-password-requirements"
              : "register-password-requirements"
          }
          disabled={isPending}
          {...register("password")}
        />
        <PasswordRequirements
          id="register-password-requirements"
          password={passwordValue}
        />
        {errors.password ? (
          <p
            id="register-password-error"
            className="text-destructive text-xs"
            role="alert"
          >
            {errors.password.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="register-phone">Telefone / WhatsApp</Label>
        <Input
          id="register-phone"
          type="tel"
          autoComplete="tel"
          placeholder="11999999999"
          aria-invalid={Boolean(errors.phoneNumber)}
          aria-describedby={
            errors.phoneNumber ? "register-phone-error" : "register-phone-hint"
          }
          disabled={isPending}
          {...register("phoneNumber")}
        />
        <p id="register-phone-hint" className="text-muted-foreground text-xs">
          Obrigatório. Preferencialmente com DDD, só números.
        </p>
        {errors.phoneNumber ? (
          <p
            id="register-phone-error"
            className="text-destructive text-xs"
            role="alert"
          >
            {errors.phoneNumber.message}
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
            Criando conta…
          </>
        ) : (
          "Criar conta de vendedor"
        )}
      </Button>

      <p className="text-small text-center">
        Já tem conta?{" "}
        <Link
          href={loginHref}
          className="text-primary font-medium underline-offset-4 hover:underline"
        >
          Entrar
        </Link>
      </p>
    </form>
  );
}

export { RegisterForm };
