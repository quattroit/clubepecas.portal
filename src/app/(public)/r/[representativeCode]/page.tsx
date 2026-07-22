"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/admin";
import { useReferral } from "@/components/providers/ReferralProvider";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { representativesService } from "@/services/representatives.service";

type PageState = "loading" | "invalid" | "blocked" | "redirecting";

function ReferralLandingPage() {
  const params = useParams<{ representativeCode: string }>();
  const router = useRouter();
  const referral = useReferral();
  const [state, setState] = useState<PageState>("loading");
  const [incomingCode, setIncomingCode] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!referral.isReady) return;

    const raw = params.representativeCode;
    const code = (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? "";

    if (!code) {
      setState("invalid");
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const data = await representativesService.getByCode(code);
        if (cancelled) return;

        const result = await referral.save(data.representativeCode);

        if (result.status === "blocked") {
          setIncomingCode(result.pendingCode);
          setState("blocked");
          setConfirmOpen(true);
          toast.message("Você já possui uma indicação ativa.");
          return;
        }

        setState("redirecting");
        router.replace(ROUTES.PLANS);
      } catch {
        if (!cancelled) setState("invalid");
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot per code when ready
  }, [referral.isReady, params.representativeCode]);

  const handleAcceptSwap = async () => {
    if (!incomingCode) return;
    await referral.save(incomingCode, { force: true });
    setConfirmOpen(false);
    setState("redirecting");
    router.replace(ROUTES.PLANS);
  };

  const handleKeepCurrent = () => {
    setConfirmOpen(false);
    setState("redirecting");
    router.replace(ROUTES.PLANS);
  };

  if (state === "invalid") {
    return (
      <main className="mx-auto flex min-h-[50vh] w-full max-w-lg flex-col items-center justify-center gap-4 px-4 py-16 text-center">
        <h1 className="text-h1">Link de indicação inválido.</h1>
        <p className="text-muted-foreground text-sm">
          Verifique o link recebido ou continue explorando os planos disponíveis.
        </p>
        <Button type="button" variant="primary" onClick={() => router.push(ROUTES.PLANS)}>
          Ver planos
        </Button>
      </main>
    );
  }

  if (state === "blocked") {
    return (
      <main className="mx-auto flex min-h-[50vh] w-full max-w-lg flex-col items-center justify-center gap-4 px-4 py-16 text-center">
        <h1 className="text-h1">Você já possui uma indicação ativa.</h1>
        <p className="text-muted-foreground text-sm">
          Indicado por{" "}
          <span className="text-foreground font-medium">
            {referral.representativeName ?? "Representante"}
          </span>{" "}
          (<span className="font-mono">{referral.representativeCode}</span>).
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button type="button" variant="outline" onClick={handleKeepCurrent}>
            Manter indicação atual
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => setConfirmOpen(true)}
          >
            Trocar Indicação
          </Button>
        </div>

        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Trocar indicação?"
          description={
            incomingCode
              ? `Substituir ${referral.representativeCode} por ${incomingCode}?`
              : "Deseja substituir a indicação atual?"
          }
          confirmLabel="Trocar Indicação"
          confirmVariant="primary"
          onConfirm={() => {
            void handleAcceptSwap();
          }}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[50vh] w-full max-w-lg flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      <Loader2 className="text-muted-foreground size-8 animate-spin" aria-hidden />
      <p className="text-muted-foreground text-sm">
        {state === "redirecting"
          ? "Redirecionando para os planos…"
          : "Validando indicação…"}
      </p>
    </main>
  );
}

export default ReferralLandingPage;
