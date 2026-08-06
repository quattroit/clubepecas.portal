"use client";

import { useEffect, useRef, useState } from "react";
import { Check, PackagePlus } from "lucide-react";

import { useAuth } from "@/components/providers/AuthProvider";
import { useQuotationDraft } from "@/components/providers/QuotationDraftProvider";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/contracts/common/enums";
import { cn } from "@/lib/utils";

type AddToQuotationButtonProps = {
  advertisementId: number;
  sellerId: number;
  storeName: string;
  sellerWhatsApp?: string | null;
  title: string;
  thumbnailUrl: string | null;
  slug: string;
  className?: string;
};

/**
 * Adiciona o anúncio ao rascunho da Central de Cotações.
 * Visível apenas para o comprador profissional (regra de acesso da cotação).
 */
function AddToQuotationButton({
  advertisementId,
  sellerId,
  storeName,
  sellerWhatsApp,
  title,
  thumbnailUrl,
  slug,
  className,
}: AddToQuotationButtonProps) {
  const { user } = useAuth();
  const { addItem } = useQuotationDraft();
  const [justAdded, setJustAdded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (user?.role !== UserRole.ProfessionalBuyer) {
    return null;
  }

  const handleClick = () => {
    addItem({
      advertisementId,
      sellerId,
      storeName,
      sellerWhatsApp: sellerWhatsApp ?? null,
      title,
      thumbnailUrl,
      slug,
    });
    setJustAdded(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <Button
      type="button"
      variant="primary"
      size="lg"
      className={cn(
        "w-full gap-2 font-semibold shadow-sm",
        justAdded &&
          "bg-success text-success-foreground hover:bg-success disabled:opacity-100",
        className,
      )}
      onClick={handleClick}
      disabled={justAdded}
    >
      {justAdded ? <Check aria-hidden /> : <PackagePlus aria-hidden />}
      {justAdded ? "Adicionado à Cotação" : "Adicionar à Cotação"}
    </Button>
  );
}

export { AddToQuotationButton };
export type { AddToQuotationButtonProps };
