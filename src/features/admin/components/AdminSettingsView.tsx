"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  AdminCard,
  AdminPage,
  AdminSection,
  ConfirmDialog,
} from "@/components/admin";
import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { PersonType } from "@/contracts/common/enums";
import { ROUTES } from "@/constants/routes";
import { AdminSettingsFormSkeleton } from "@/features/admin/components/AdminSettingsFormSkeleton";
import {
  platformSettingsFormDefaultValues,
  platformSettingsFormSchema,
  type PlatformSettingsFormValues,
} from "@/features/admin/schemas/platformSettingsFormSchema";
import { useAdminPlatformSettings } from "@/hooks/api/useAdminPlatformSettings";
import { useUpdateAdminPlatformSettings } from "@/hooks/api/useUpdateAdminPlatformSettings";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import {
  mapPlatformSettingsFormToRequest,
  mapPlatformSettingsToForm,
} from "@/mappers/platform-settings-form.mapper";
import { formatDocumentInput } from "@/utils/document";

const selectClassName = cn(
  "border-input bg-surface text-foreground h-10 w-full rounded-xl border px-3 text-sm outline-none",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

/**
 * Painel de configurações globais da plataforma.
 */
function AdminSettingsView() {
  const router = useRouter();
  const settingsQuery = useAdminPlatformSettings();
  const updateMutation = useUpdateAdminPlatformSettings();

  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const pendingHrefRef = useRef<string | null>(null);
  const allowNavigationRef = useRef(false);

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [pendingValues, setPendingValues] =
    useState<PlatformSettingsFormValues | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<PlatformSettingsFormValues>({
    resolver: zodResolver(platformSettingsFormSchema),
    shouldFocusError: true,
    defaultValues: platformSettingsFormDefaultValues,
  });

  useEffect(() => {
    if (!settingsQuery.data) return;
    reset(mapPlatformSettingsToForm(settingsQuery.data));
  }, [settingsQuery.data, reset]);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty || allowNavigationRef.current) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (!isDirty) return;

    const onDocumentClick = (event: MouseEvent) => {
      if (allowNavigationRef.current) return;
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:")) return;

      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      pendingHrefRef.current = `${url.pathname}${url.search}${url.hash}`;
      setLeaveDialogOpen(true);
    };

    document.addEventListener("click", onDocumentClick, true);
    return () => document.removeEventListener("click", onDocumentClick, true);
  }, [isDirty]);

  const isSubmitting = updateMutation.isPending;

  const onSubmit = handleSubmit((values) => {
    if (isSubmitting) return;

    setPendingValues(values);
    setSaveDialogOpen(true);
  });

  const confirmLeave = () => {
    const href = pendingHrefRef.current;
    allowNavigationRef.current = true;
    setLeaveDialogOpen(false);
    pendingHrefRef.current = null;
    if (href) {
      router.push(href);
    }
  };

  const confirmSave = () => {
    if (!pendingValues || isSubmitting) return;

    updateMutation.mutate(mapPlatformSettingsFormToRequest(pendingValues), {
      onSuccess: (data) => {
        reset(mapPlatformSettingsToForm(data));
        setSaveDialogOpen(false);
        setPendingValues(null);
      },
    });
  };

  if (settingsQuery.isLoading) {
    return (
      <AdminPage
        title="Configurações"
        description="Gerencie informações institucionais, funcionalidades e limites da plataforma."
        breadcrumb={[
          { label: "Admin", href: ROUTES.ADMIN },
          { label: "Configurações" },
        ]}
      >
        <AdminSettingsFormSkeleton />
      </AdminPage>
    );
  }

  if (settingsQuery.isError || !settingsQuery.data) {
    return (
      <AdminPage
        title="Configurações"
        description="Gerencie informações institucionais, funcionalidades e limites da plataforma."
        breadcrumb={[
          { label: "Admin", href: ROUTES.ADMIN },
          { label: "Configurações" },
        ]}
      >
        <ErrorMessage
          title="Não foi possível carregar as configurações"
          message={getFriendlyErrorMessage(settingsQuery.error)}
        />
      </AdminPage>
    );
  }

  return (
    <AdminPage
      title="Configurações"
      description="Gerencie informações institucionais, funcionalidades e limites da plataforma."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Configurações" },
      ]}
      actions={
        <Button
          type="submit"
          form="admin-platform-settings-form"
          disabled={!isDirty || isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Salvando…
            </>
          ) : (
            "Salvar alterações"
          )}
        </Button>
      }
    >
      <form
        id="admin-platform-settings-form"
        onSubmit={onSubmit}
        className="flex flex-col gap-6"
        noValidate
        aria-busy={isSubmitting}
      >
        {updateMutation.isError ? (
          <ErrorMessage
            title="Não foi possível salvar as configurações"
            message={getFriendlyErrorMessage(updateMutation.error)}
          />
        ) : null}

        <AdminSection
          title="Informações institucionais"
          description="Nome e apresentação pública da plataforma."
        >
          <AdminCard>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="platform-name"
                label="Nome da plataforma"
                error={errors.platformName?.message}
              >
                <Input
                  id="platform-name"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.platformName)}
                  {...register("platformName")}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field
                  id="platform-description"
                  label="Descrição"
                  error={errors.platformDescription?.message}
                >
                  <Textarea
                    id="platform-description"
                    rows={3}
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.platformDescription)}
                    {...register("platformDescription")}
                  />
                </Field>
              </div>
            </div>
          </AdminCard>
        </AdminSection>

        <AdminSection title="Contato" description="Canais oficiais de atendimento.">
          <AdminCard>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="support-email"
                label="E-mail de suporte"
                error={errors.supportEmail?.message}
              >
                <Input
                  id="support-email"
                  type="email"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.supportEmail)}
                  {...register("supportEmail")}
                />
              </Field>
              <Field
                id="whatsapp"
                label="WhatsApp"
                error={errors.whatsApp?.message}
              >
                <Input
                  id="whatsapp"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.whatsApp)}
                  {...register("whatsApp")}
                />
              </Field>
              <Field
                id="support-phone"
                label="Telefone"
                error={errors.supportPhone?.message}
              >
                <Input
                  id="support-phone"
                  type="tel"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.supportPhone)}
                  {...register("supportPhone")}
                />
              </Field>
            </div>
          </AdminCard>
        </AdminSection>

        <AdminSection title="Endereço" description="Endereço institucional da empresa.">
          <AdminCard>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="company-name" label="Razão social" error={errors.companyName?.message}>
                <Input id="company-name" disabled={isSubmitting} {...register("companyName")} />
              </Field>
              <Field id="street" label="Logradouro" error={errors.street?.message}>
                <Input id="street" disabled={isSubmitting} {...register("street")} />
              </Field>
              <Field id="number" label="Número" error={errors.number?.message}>
                <Input id="number" disabled={isSubmitting} {...register("number")} />
              </Field>
              <Field id="complement" label="Complemento" error={errors.complement?.message}>
                <Input id="complement" disabled={isSubmitting} {...register("complement")} />
              </Field>
              <Field id="neighborhood" label="Bairro" error={errors.neighborhood?.message}>
                <Input id="neighborhood" disabled={isSubmitting} {...register("neighborhood")} />
              </Field>
              <Field id="city" label="Cidade" error={errors.city?.message}>
                <Input id="city" disabled={isSubmitting} {...register("city")} />
              </Field>
              <Field id="state" label="Estado" error={errors.state?.message}>
                <Input id="state" disabled={isSubmitting} {...register("state")} />
              </Field>
              <Field id="zip-code" label="CEP" error={errors.zipCode?.message}>
                <Input id="zip-code" disabled={isSubmitting} {...register("zipCode")} />
              </Field>
              <Field id="country" label="País" error={errors.country?.message}>
                <Input id="country" disabled={isSubmitting} {...register("country")} />
              </Field>
            </div>
          </AdminCard>
        </AdminSection>

        <AdminSection title="Documento" description="Dados cadastrais da empresa.">
          <AdminCard>
            <Field id="company-document" label="CNPJ" error={errors.companyDocument?.message}>
              <Controller
                name="companyDocument"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="company-document"
                    inputMode="numeric"
                    placeholder="00.000.000/0000-00"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.companyDocument)}
                    onChange={(event) =>
                      field.onChange(
                        formatDocumentInput(event.target.value, PersonType.Company),
                      )
                    }
                  />
                )}
              />
            </Field>
          </AdminCard>
        </AdminSection>

        <AdminSection title="SEO" description="Metadados padrão para buscadores e compartilhamentos.">
          <AdminCard>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="default-title"
                label="Título padrão"
                error={errors.defaultTitle?.message}
              >
                <Input
                  id="default-title"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.defaultTitle)}
                  {...register("defaultTitle")}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field
                  id="default-description"
                  label="Descrição padrão"
                  error={errors.defaultDescription?.message}
                >
                  <Textarea
                    id="default-description"
                    rows={3}
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.defaultDescription)}
                    {...register("defaultDescription")}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field id="default-keywords" label="Palavras-chave" error={errors.defaultKeywords?.message}>
                  <Textarea id="default-keywords" rows={2} disabled={isSubmitting} {...register("defaultKeywords")} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field
                  id="default-og-image"
                  label="Imagem Open Graph (URL)"
                  error={errors.defaultOgImage?.message}
                >
                  <Input
                    id="default-og-image"
                    type="url"
                    placeholder="https://… ou /images/…"
                    disabled={isSubmitting}
                    {...register("defaultOgImage")}
                  />
                </Field>
              </div>
            </div>
          </AdminCard>
        </AdminSection>

        <AdminSection title="Redes sociais" description="Links públicos da plataforma.">
          <AdminCard>
            <div className="grid gap-4 sm:grid-cols-2">
              {([
                ["instagram", "Instagram"],
                ["facebook", "Facebook"],
                ["youTube", "YouTube"],
                ["tikTok", "TikTok"],
                ["linkedIn", "LinkedIn"],
                ["x", "X"],
                ["website", "Website"],
              ] as const).map(([name, label]) => (
                <Field key={name} id={name} label={label} error={errors[name]?.message}>
                  <Input id={name} placeholder="https://" disabled={isSubmitting} {...register(name)} />
                </Field>
              ))}
            </div>
          </AdminCard>
        </AdminSection>

        <AdminSection title="Identidade visual" description="URLs das imagens públicas da marca.">
          <AdminCard>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="logo-url" label="Logo" error={errors.logoUrl?.message}>
                <Input id="logo-url" type="url" placeholder="/images/logo.png ou https://" disabled={isSubmitting} {...register("logoUrl")} />
              </Field>
              <Field id="logo-dark-url" label="Logo para fundo escuro" error={errors.logoDarkUrl?.message}>
                <Input id="logo-dark-url" type="url" placeholder="/images/logo-dark.png ou https://" disabled={isSubmitting} {...register("logoDarkUrl")} />
              </Field>
              <Field id="favicon-url" label="Favicon" error={errors.faviconUrl?.message}>
                <Input id="favicon-url" type="url" placeholder="/favicon.ico ou https://" disabled={isSubmitting} {...register("faviconUrl")} />
              </Field>
            </div>
          </AdminCard>
        </AdminSection>

        <AdminSection
          title="Programa de Representantes"
          description="Regras de comissionamento aplicadas a novas indicações de representantes."
        >
          <AdminCard>
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4 rounded-xl border p-4">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="representative-program-enabled">
                    Programa ativo
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Habilita o programa de representantes e a geração de novas
                    comissões.
                  </p>
                </div>
                <Controller
                  name="representativeProgramEnabled"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="representative-program-enabled"
                      checked={field.value}
                      disabled={isSubmitting}
                      onCheckedChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  id="representative-first-sale-commission"
                  label="Comissão da primeira venda (%)"
                  error={
                    errors.representativeFirstSaleCommissionPercentage?.message
                  }
                >
                  <Input
                    id="representative-first-sale-commission"
                    type="number"
                    min={0}
                    max={100}
                    step={0.01}
                    inputMode="decimal"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(
                      errors.representativeFirstSaleCommissionPercentage,
                    )}
                    {...register(
                      "representativeFirstSaleCommissionPercentage",
                      { valueAsNumber: true },
                    )}
                  />
                </Field>
                <Field
                  id="representative-recurring-commission"
                  label="Comissão recorrente (%)"
                  error={
                    errors.representativeRecurringCommissionPercentage
                      ?.message
                  }
                >
                  <Input
                    id="representative-recurring-commission"
                    type="number"
                    min={0}
                    max={100}
                    step={0.01}
                    inputMode="decimal"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(
                      errors.representativeRecurringCommissionPercentage,
                    )}
                    {...register(
                      "representativeRecurringCommissionPercentage",
                      { valueAsNumber: true },
                    )}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <p className="text-muted-foreground text-xs">
                    Este percentual será utilizado apenas para novas
                    comissões. As comissões já geradas não serão alteradas.
                  </p>
                </div>

                <Field
                  id="representative-commission-currency"
                  label="Moeda"
                  error={errors.representativeCommissionCurrency?.message}
                >
                  <select
                    id="representative-commission-currency"
                    className={selectClassName}
                    disabled
                    aria-invalid={Boolean(
                      errors.representativeCommissionCurrency,
                    )}
                    {...register("representativeCommissionCurrency")}
                  >
                    <option value="BRL">BRL</option>
                  </select>
                </Field>
                <Field
                  id="representative-minimum-payout-amount"
                  label="Valor mínimo para pagamento"
                  error={errors.representativeMinimumPayoutAmount?.message}
                >
                  <Input
                    id="representative-minimum-payout-amount"
                    type="number"
                    min={0}
                    step={0.01}
                    inputMode="decimal"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(
                      errors.representativeMinimumPayoutAmount,
                    )}
                    {...register("representativeMinimumPayoutAmount", {
                      valueAsNumber: true,
                    })}
                  />
                </Field>
                <Field
                  id="representative-default-payout-day"
                  label="Dia padrão de pagamento"
                  error={errors.representativeDefaultPayoutDay?.message}
                >
                  <Input
                    id="representative-default-payout-day"
                    type="number"
                    min={1}
                    max={28}
                    step={1}
                    inputMode="numeric"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(
                      errors.representativeDefaultPayoutDay,
                    )}
                    {...register("representativeDefaultPayoutDay", {
                      valueAsNumber: true,
                    })}
                  />
                </Field>

                <div className="sm:col-span-2">
                  <Field
                    id="representative-commission-notes"
                    label="Observações internas"
                    error={errors.representativeCommissionNotes?.message}
                  >
                    <Textarea
                      id="representative-commission-notes"
                      rows={3}
                      disabled={isSubmitting}
                      aria-invalid={Boolean(
                        errors.representativeCommissionNotes,
                      )}
                      {...register("representativeCommissionNotes")}
                    />
                  </Field>
                </div>
              </div>
            </div>
          </AdminCard>
        </AdminSection>

        <AdminSection title="Footer" description="Texto exibido no rodapé público.">
          <AdminCard>
            <Field id="footer-copyright" label="Copyright" error={errors.footerCopyright?.message}>
              <Input id="footer-copyright" placeholder="© {year} Minha empresa. Todos os direitos reservados." disabled={isSubmitting} {...register("footerCopyright")} />
            </Field>
          </AdminCard>
        </AdminSection>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!isDirty || isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Salvando…
              </>
            ) : (
              "Salvar alterações"
            )}
          </Button>
        </div>
      </form>

      <ConfirmDialog
        open={leaveDialogOpen}
        onOpenChange={(open) => {
          setLeaveDialogOpen(open);
          if (!open) {
            pendingHrefRef.current = null;
          }
        }}
        title="Alterações não salvas"
        description="Você tem alterações que ainda não foram salvas. Deseja sair sem salvar?"
        confirmLabel="Sair sem salvar"
        cancelLabel="Continuar editando"
        confirmVariant="destructive"
        onConfirm={confirmLeave}
      />

      <ConfirmDialog
        open={saveDialogOpen}
        onOpenChange={(open) => {
          setSaveDialogOpen(open);
          if (!open && !isSubmitting) {
            setPendingValues(null);
          }
        }}
        title="Confirmar alterações"
        description="Os percentuais de comissão de representantes serão aplicados apenas a novas comissões geradas a partir de agora — comissões já geradas não serão alteradas. Deseja salvar as alterações?"
        confirmLabel="Salvar alterações"
        cancelLabel="Continuar editando"
        confirmVariant="primary"
        loading={isSubmitting}
        onConfirm={confirmSave}
      />
    </AdminPage>
  );
}

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
};

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          className="text-destructive text-xs"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export { AdminSettingsView };
