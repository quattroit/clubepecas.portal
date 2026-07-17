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
import {
  mapPlatformSettingsFormToRequest,
  mapPlatformSettingsToForm,
} from "@/mappers/platform-settings-form.mapper";

type FeatureToggle = {
  name: keyof Pick<
    PlatformSettingsFormValues,
    | "marketplaceEnabled"
    | "sellerRegistrationEnabled"
    | "advertisementCreationEnabled"
    | "analyticsEnabled"
    | "shareEnabled"
    | "whatsAppEnabled"
    | "instagramEnabled"
  >;
  label: string;
  description: string;
};

const FEATURE_TOGGLES: FeatureToggle[] = [
  {
    name: "marketplaceEnabled",
    label: "Marketplace ativo",
    description: "Exibe o marketplace publicamente.",
  },
  {
    name: "sellerRegistrationEnabled",
    label: "Cadastro de vendedores",
    description: "Permite novos cadastros de vendedores.",
  },
  {
    name: "advertisementCreationEnabled",
    label: "Publicação de anúncios",
    description: "Permite criar e publicar anúncios.",
  },
  {
    name: "analyticsEnabled",
    label: "Analytics",
    description: "Coleta e exibe métricas da plataforma.",
  },
  {
    name: "shareEnabled",
    label: "Compartilhamento",
    description: "Habilita ações de compartilhamento.",
  },
  {
    name: "whatsAppEnabled",
    label: "WhatsApp",
    description: "Exibe contato via WhatsApp nos anúncios.",
  },
  {
    name: "instagramEnabled",
    label: "Instagram",
    description: "Exibe links e ações do Instagram.",
  },
];

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

    updateMutation.mutate(mapPlatformSettingsFormToRequest(values), {
      onSuccess: (data) => {
        reset(mapPlatformSettingsToForm(data));
      },
    });
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
          description="Dados de contato e presença digital da plataforma."
        >
          <AdminCard>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="marketplace-name"
                label="Nome da plataforma"
                error={errors.marketplaceName?.message}
              >
                <Input
                  id="marketplace-name"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.marketplaceName)}
                  {...register("marketplaceName")}
                />
              </Field>

              <Field
                id="contact-email"
                label="E-mail"
                error={errors.contactEmail?.message}
              >
                <Input
                  id="contact-email"
                  type="email"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.contactEmail)}
                  {...register("contactEmail")}
                />
              </Field>

              <div className="sm:col-span-2">
                <Field
                  id="marketplace-description"
                  label="Descrição"
                  error={errors.marketplaceDescription?.message}
                >
                  <Textarea
                    id="marketplace-description"
                    rows={3}
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.marketplaceDescription)}
                    {...register("marketplaceDescription")}
                  />
                </Field>
              </div>

              <Field
                id="contact-phone"
                label="Telefone"
                error={errors.contactPhone?.message}
              >
                <Input
                  id="contact-phone"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.contactPhone)}
                  {...register("contactPhone")}
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
                id="instagram"
                label="Instagram"
                error={errors.instagram?.message}
              >
                <Input
                  id="instagram"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.instagram)}
                  {...register("instagram")}
                />
              </Field>

              <Field
                id="facebook"
                label="Facebook"
                error={errors.facebook?.message}
              >
                <Input
                  id="facebook"
                  type="url"
                  placeholder="https://"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.facebook)}
                  {...register("facebook")}
                />
              </Field>

              <Field
                id="youtube"
                label="YouTube"
                error={errors.youTube?.message}
              >
                <Input
                  id="youtube"
                  type="url"
                  placeholder="https://"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.youTube)}
                  {...register("youTube")}
                />
              </Field>

              <Field
                id="website"
                label="Website"
                error={errors.website?.message}
              >
                <Input
                  id="website"
                  type="url"
                  placeholder="https://"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.website)}
                  {...register("website")}
                />
              </Field>
            </div>
          </AdminCard>
        </AdminSection>

        <AdminSection
          title="Funcionalidades"
          description="Ative ou desative recursos globais da plataforma."
        >
          <AdminCard>
            <ul className="flex flex-col gap-4">
              {FEATURE_TOGGLES.map((feature) => (
                <li
                  key={feature.name}
                  className="border-border flex items-start justify-between gap-4 border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <Label
                      htmlFor={`feature-${feature.name}`}
                      className="text-sm font-medium"
                    >
                      {feature.label}
                    </Label>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {feature.description}
                    </p>
                  </div>
                  <Controller
                    name={feature.name}
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id={`feature-${feature.name}`}
                        checked={field.value}
                        disabled={isSubmitting}
                        onCheckedChange={field.onChange}
                        onBlur={field.onBlur}
                      />
                    )}
                  />
                </li>
              ))}
            </ul>
          </AdminCard>
        </AdminSection>

        <AdminSection
          title="Limites"
          description="Limites padrão da plataforma. Planos poderão sobrescrevê-los no futuro."
        >
          <AdminCard>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="default-advertisement-limit"
                label="Limite padrão de anúncios"
                error={errors.defaultAdvertisementLimit?.message}
              >
                <Input
                  id="default-advertisement-limit"
                  type="number"
                  min={1}
                  inputMode="numeric"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.defaultAdvertisementLimit)}
                  {...register("defaultAdvertisementLimit", {
                    valueAsNumber: true,
                  })}
                />
              </Field>

              <Field
                id="default-images-per-advertisement"
                label="Máximo de imagens"
                error={errors.defaultImagesPerAdvertisement?.message}
              >
                <Input
                  id="default-images-per-advertisement"
                  type="number"
                  min={1}
                  inputMode="numeric"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.defaultImagesPerAdvertisement)}
                  {...register("defaultImagesPerAdvertisement", {
                    valueAsNumber: true,
                  })}
                />
              </Field>

              <Field
                id="max-image-size-mb"
                label="Tamanho máximo das imagens (MB)"
                error={errors.maxImageSizeMb?.message}
              >
                <Input
                  id="max-image-size-mb"
                  type="number"
                  min={1}
                  inputMode="numeric"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.maxImageSizeMb)}
                  {...register("maxImageSizeMb", { valueAsNumber: true })}
                />
              </Field>

              <Field
                id="online-timeout-minutes"
                label="Tempo considerado online (minutos)"
                error={errors.onlineTimeoutMinutes?.message}
              >
                <Input
                  id="online-timeout-minutes"
                  type="number"
                  min={1}
                  inputMode="numeric"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.onlineTimeoutMinutes)}
                  {...register("onlineTimeoutMinutes", {
                    valueAsNumber: true,
                  })}
                />
              </Field>
            </div>
          </AdminCard>
        </AdminSection>

        <AdminSection
          title="SEO (preparação)"
          description="Metadados globais persistidos para uso futuro — ainda não consumidos pela aplicação."
        >
          <AdminCard>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="default-meta-title"
                label="Meta Title padrão"
                error={errors.defaultMetaTitle?.message}
              >
                <Input
                  id="default-meta-title"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.defaultMetaTitle)}
                  {...register("defaultMetaTitle")}
                />
              </Field>

              <Field
                id="default-og-image"
                label="Open Graph padrão"
                error={errors.defaultOgImage?.message}
              >
                <Input
                  id="default-og-image"
                  type="url"
                  placeholder="https://"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.defaultOgImage)}
                  {...register("defaultOgImage")}
                />
              </Field>

              <div className="sm:col-span-2">
                <Field
                  id="default-meta-description"
                  label="Meta Description padrão"
                  error={errors.defaultMetaDescription?.message}
                >
                  <Textarea
                    id="default-meta-description"
                    rows={3}
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.defaultMetaDescription)}
                    {...register("defaultMetaDescription")}
                  />
                </Field>
              </div>
            </div>
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
