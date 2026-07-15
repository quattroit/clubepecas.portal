"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRole } from "@/contracts/common/enums";
import { ROUTES } from "@/constants/routes";
import { useRegister } from "@/hooks/api/useRegister";
import { getSafeAuthNextPath } from "@/lib/announce-flow";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";

const BUYER = String(UserRole.Buyer);
const SELLER = String(UserRole.Seller);

const registerSchema = z.object({
  firstName: z.string().min(1, "Informe o nome"),
  lastName: z.string().min(1, "Informe o sobrenome"),
  email: z.string().min(1, "Informe o e-mail").email("E-mail inválido"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
  phoneNumber: z.string().optional(),
  userRole: z.enum([BUYER, SELLER], {
    message: "Selecione o tipo de conta",
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const selectClassName =
  "border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-lg border px-2.5 text-sm outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50";

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
      userRole: BUYER,
    },
  });

  const isPending = registerMutation.isPending;

  const onSubmit = handleSubmit((values) => {
    if (isPending) return;
    registerMutation.mutate({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      phoneNumber: values.phoneNumber?.trim()
        ? values.phoneNumber.trim()
        : null,
      userRole: Number(values.userRole) as UserRole,
    });
  });

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full flex-col gap-4"
      noValidate
      aria-busy={isPending}
    >
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-h1">Criar conta</h1>
        <p className="text-small">Cadastre-se no ClubePeças.</p>
      </div>

      {registerMutation.isError ? (
        <ErrorMessage
          title="Falha no cadastro"
          message={getFriendlyErrorMessage(registerMutation.error)}
        />
      ) : null}

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
        <Input
          id="register-password"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={
            errors.password ? "register-password-error" : undefined
          }
          disabled={isPending}
          {...register("password")}
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
        <Label htmlFor="register-phone">Telefone (opcional)</Label>
        <Input
          id="register-phone"
          type="tel"
          autoComplete="tel"
          disabled={isPending}
          {...register("phoneNumber")}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="register-role">Tipo de conta</Label>
        <select
          id="register-role"
          className={selectClassName}
          aria-invalid={Boolean(errors.userRole)}
          aria-describedby={
            errors.userRole ? "register-role-error" : undefined
          }
          disabled={isPending}
          {...register("userRole")}
        >
          <option value={BUYER}>Comprador</option>
          <option value={SELLER}>Vendedor</option>
        </select>
        {errors.userRole ? (
          <p
            id="register-role-error"
            className="text-destructive text-xs"
            role="alert"
          >
            {errors.userRole.message}
          </p>
        ) : null}
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? "Criando conta…" : "Criar conta"}
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
