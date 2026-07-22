"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { representativesService } from "@/services/representatives.service";
import { saveRepresentativeReferral } from "@/utils/representativeReferral";

type PageState = "loading" | "invalid" | "redirecting";

function ReferralLandingPage() {
  const params = useParams<{ representativeCode: string }>();
  const router = useRouter();
  const [state, setState] = useState<PageState>("loading");

  useEffect(() => {
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
        saveRepresentativeReferral(data.representativeCode);
        setState("redirecting");
        router.replace(ROUTES.PLANS);
      } catch {
        if (!cancelled) setState("invalid");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [params.representativeCode, router]);

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
