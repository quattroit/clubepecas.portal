"use client";

import Link from "next/link";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { buttonVariants } from "@/components/ui/button";
import { SellerLocalDeliverySettingsCard } from "@/features/dashboard/components/SellerLocalDeliverySettingsCard";
import { SellerProfileSkeleton } from "@/features/dashboard/components/SellerProfileSkeleton";
import { useSeller } from "@/hooks/api/useSeller";
import { ROUTES } from "@/constants/routes";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";

/**
 * Página Cadastros → Frete Local.
 */
function SellerLocalDeliveryView() {
  const sellerQuery = useSeller();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-h1">Frete Local</h1>
        <p className="text-small text-muted-foreground">
          Configure entrega com motoboy ou veículo próprio. O valor mostrado ao
          cliente é apenas uma estimativa.
        </p>
      </div>

      {sellerQuery.isLoading ? <SellerProfileSkeleton /> : null}

      {sellerQuery.isError ? (
        <ErrorMessage
          title="Não foi possível carregar o perfil"
          message={getFriendlyErrorMessage(sellerQuery.error)}
        />
      ) : null}

      {!sellerQuery.isLoading &&
      !sellerQuery.isError &&
      sellerQuery.data === null ? (
        <div
          role="status"
          className="border-border bg-secondary text-secondary-foreground flex flex-col gap-3 rounded-lg border px-4 py-3"
        >
          <p className="text-small">
            Complete o perfil da loja antes de configurar o Frete Local.
          </p>
          <Link
            href={ROUTES.PROFILE}
            className={cn(buttonVariants({ variant: "outline" }), "self-start")}
          >
            Ir para Meu perfil
          </Link>
        </div>
      ) : null}

      {!sellerQuery.isLoading &&
      !sellerQuery.isError &&
      sellerQuery.data ? (
        <SellerLocalDeliverySettingsCard />
      ) : null}
    </div>
  );
}

export { SellerLocalDeliveryView };
