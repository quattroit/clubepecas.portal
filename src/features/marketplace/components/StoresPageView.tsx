"use client";

import { Store } from "lucide-react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { EmptyState } from "@/components/ui/empty-state";
import { ROUTES } from "@/constants/routes";
import { SellerGrid } from "@/features/marketplace";
import { StoresGridSkeleton } from "@/features/marketplace/components/StoresGridSkeleton";
import { useStores } from "@/hooks/api/useStores";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";

/**
 * Listagem pública /lojas — mesma UI, dados da API.
 */
function StoresPageView() {
  const storesQuery = useStores();
  const stores = storesQuery.data ?? [];
  const totalLabel =
    stores.length === 1
      ? "1 loja no marketplace"
      : `${stores.length} lojas no marketplace`;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <Breadcrumb
          items={[{ label: "Home", href: ROUTES.HOME }, { label: "Lojas" }]}
        />
        <div className="flex flex-col gap-1">
          <h1 className="text-h1">Lojas</h1>
          <p className="text-small">
            {storesQuery.isLoading ? "Carregando lojas…" : totalLabel}
          </p>
        </div>
      </header>

      {storesQuery.isLoading ? <StoresGridSkeleton /> : null}

      {storesQuery.isError ? (
        <ErrorMessage
          title="Não foi possível carregar as lojas"
          message={getFriendlyErrorMessage(storesQuery.error)}
        />
      ) : null}

      {!storesQuery.isLoading &&
      !storesQuery.isError &&
      stores.length === 0 ? (
        <EmptyState
          title="Nenhuma loja encontrada"
          description="Ainda não há lojas com anúncios publicados no marketplace."
          icon={<Store aria-hidden />}
        />
      ) : null}

      {!storesQuery.isLoading &&
      !storesQuery.isError &&
      stores.length > 0 ? (
        <SellerGrid sellers={stores} />
      ) : null}
    </div>
  );
}

export { StoresPageView };
