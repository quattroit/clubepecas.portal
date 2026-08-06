"use client";

import Link from "next/link";
import { ClipboardList } from "lucide-react";

import { useAuth } from "@/components/providers/AuthProvider";
import { useQuotationDraft } from "@/components/providers/QuotationDraftProvider";
import { UserRole } from "@/contracts/common/enums";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

type QuotationCenterLinkProps = {
  className?: string;
  onNavigate?: () => void;
  tone?: "on-brand" | "default";
};

/**
 * Link para a Central de Cotações com contador de itens do rascunho.
 * Visível somente para o comprador profissional — regra crítica de acesso.
 */
function QuotationCenterLink({
  className,
  onNavigate,
  tone = "on-brand",
}: QuotationCenterLinkProps) {
  const { user } = useAuth();
  const { totalCount } = useQuotationDraft();

  if (user?.role !== UserRole.ProfessionalBuyer) {
    return null;
  }

  return (
    <Link
      href={ROUTES.PROFESSIONAL_BUYER_QUOTATION}
      onClick={onNavigate}
      className={cn(
        "focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2",
        tone === "on-brand"
          ? "text-brand-muted hover:bg-brand-foreground/10 hover:text-brand-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      <ClipboardList className="size-4" aria-hidden />
      Central de Cotações
      {totalCount > 0 ? (
        <span
          className={cn(
            "inline-flex size-5 items-center justify-center rounded-full text-xs font-semibold",
            tone === "on-brand"
              ? "bg-primary text-primary-foreground"
              : "bg-primary text-primary-foreground",
          )}
        >
          {totalCount > 99 ? "99+" : totalCount}
        </span>
      ) : null}
    </Link>
  );
}

export { QuotationCenterLink };
