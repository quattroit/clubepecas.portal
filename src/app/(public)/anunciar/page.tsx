"use client";

import { useEffect, useRef } from "react";

import { PageLoader } from "@/components/feedback/PageLoader";
import { useAnnounceFlow } from "@/hooks/useAnnounceFlow";

/**
 * Compatibilidade: /anunciar apenas redireciona pelo fluxo Anunciar Peça.
 * Não renderiza conteúdo próprio.
 */
export default function AnnounceRedirectPage() {
  const { goToAnnounce } = useAnnounceFlow();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void goToAnnounce();
  }, [goToAnnounce]);

  return <PageLoader label="Redirecionando…" />;
}
