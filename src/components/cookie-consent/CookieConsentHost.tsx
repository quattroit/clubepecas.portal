"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useCookieConsent } from "@/components/providers/CookieConsentProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { ROUTES } from "@/constants/routes";
import type { CookieConsentPreferences } from "@/lib/cookie-consent";

function CookiePreferencesDialog() {
  const { consent, preferencesOpen, setPreferencesOpen, savePreferences } =
    useCookieConsent();
  const [draft, setDraft] = useState<CookieConsentPreferences>({
    analytics: consent?.analytics ?? false,
    marketing: consent?.marketing ?? false,
  });

  useEffect(() => {
    if (!preferencesOpen) return;
    setDraft({
      analytics: consent?.analytics ?? false,
      marketing: consent?.marketing ?? false,
    });
  }, [preferencesOpen, consent]);

  return (
    <Dialog open={preferencesOpen} onOpenChange={setPreferencesOpen}>
      <DialogContent className="max-w-lg" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Preferências de cookies</DialogTitle>
          <DialogDescription>
            Escolha quais categorias deseja permitir. Cookies essenciais são
            sempre necessários para o funcionamento do site. Consulte a{" "}
            <Link
              href={ROUTES.PRIVACY}
              className="text-primary underline-offset-2 hover:underline"
              onClick={() => setPreferencesOpen(false)}
            >
              Política de Privacidade
            </Link>
            .
          </DialogDescription>
        </DialogHeader>

        <ul className="flex flex-col gap-4">
          <li className="border-border flex items-start justify-between gap-4 rounded-xl border p-3.5">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Essenciais</p>
              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                Necessários para login, segurança, sessão e indicação de
                representantes. Sempre ativos.
              </p>
            </div>
            <Switch checked disabled aria-label="Cookies essenciais (sempre ativos)" />
          </li>

          <li className="border-border flex items-start justify-between gap-4 rounded-xl border p-3.5">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Analíticos</p>
              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                Ajudam a entender o uso da plataforma (visualizações de anúncios
                e lojas) de forma agregada e anônima.
              </p>
            </div>
            <Switch
              checked={draft.analytics}
              onCheckedChange={(checked) =>
                setDraft((current) => ({ ...current, analytics: checked }))
              }
              aria-label="Cookies analíticos"
            />
          </li>

          <li className="border-border flex items-start justify-between gap-4 rounded-xl border p-3.5">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Marketing</p>
              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                Usados para comunicações e campanhas, quando disponíveis. Hoje
                não há cookies de marketing ativos.
              </p>
            </div>
            <Switch
              checked={draft.marketing}
              onCheckedChange={(checked) =>
                setDraft((current) => ({ ...current, marketing: checked }))
              }
              aria-label="Cookies de marketing"
            />
          </li>
        </ul>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setPreferencesOpen(false)}
          >
            Cancelar
          </Button>
          <Button type="button" variant="primary" onClick={() => savePreferences(draft)}>
            Salvar preferências
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CookieConsentBanner() {
  const {
    ready,
    consent,
    acceptAll,
    acceptEssentialOnly,
    setPreferencesOpen,
  } = useCookieConsent();

  if (!ready || consent) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      className="border-border bg-surface/95 fixed inset-x-0 bottom-0 z-50 border-t p-4 shadow-lg backdrop-blur-sm sm:p-5"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 flex-1">
          <p id="cookie-consent-title" className="text-sm font-semibold">
            Privacidade e cookies
          </p>
          <p
            id="cookie-consent-description"
            className="text-muted-foreground mt-1.5 text-sm leading-relaxed"
          >
            Usamos cookies essenciais para o funcionamento do site e, com sua
            permissão, cookies analíticos para melhorar a experiência. Você pode
            aceitar todos, manter apenas os essenciais ou personalizar. Saiba
            mais na{" "}
            <Link
              href={ROUTES.PRIVACY}
              className="text-foreground underline-offset-2 hover:underline"
            >
              Política de Privacidade
            </Link>
            .
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => setPreferencesOpen(true)}
          >
            Personalizar
          </Button>
          <Button type="button" variant="outline" onClick={acceptEssentialOnly}>
            Apenas essenciais
          </Button>
          <Button type="button" variant="primary" onClick={acceptAll}>
            Aceitar todos
          </Button>
        </div>
      </div>
    </div>
  );
}

function CookieConsentHost() {
  return (
    <>
      <CookieConsentBanner />
      <CookiePreferencesDialog />
    </>
  );
}

export { CookieConsentBanner, CookieConsentHost, CookiePreferencesDialog };
