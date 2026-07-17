"use client";

import { FolderOpen } from "lucide-react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { EmptyState } from "@/components/ui/empty-state";
import { ROUTES } from "@/constants/routes";
import { CategoryGrid } from "@/features/marketplace";
import { CategoryGridSkeleton } from "@/features/marketplace/components/CategoryGridSkeleton";
import { useCategories } from "@/hooks/api/useCategories";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";

/**
 * Listagem pública /categorias — dados e contagens vêm da API (GET /categories).
 */
function CategoriesPageView() {
  const categoriesQuery = useCategories();

  const categories = categoriesQuery.data ?? [];
  const isLoading = categoriesQuery.isLoading;
  const isError = categoriesQuery.isError;
  const error = categoriesQuery.error;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "Home", href: ROUTES.HOME },
            { label: "Categorias" },
          ]}
        />
        <div className="flex max-w-2xl flex-col gap-2">
          <h1 className="text-h1">Categorias</h1>
          <p className="text-body text-muted-foreground">
            Encontre rapidamente peças automotivas navegando por categoria.
          </p>
        </div>
      </header>

      <section aria-labelledby="categories-grid-heading">
        <h2 id="categories-grid-heading" className="sr-only">
          Lista de categorias
        </h2>

        {isLoading ? <CategoryGridSkeleton /> : null}

        {isError ? (
          <ErrorMessage
            title="Não foi possível carregar as categorias"
            message={getFriendlyErrorMessage(error)}
          />
        ) : null}

        {!isLoading && !isError && categories.length === 0 ? (
          <EmptyState
            title="Nenhuma categoria disponível"
            description="As categorias do marketplace ainda não estão disponíveis."
            icon={<FolderOpen aria-hidden />}
          />
        ) : null}

        {!isLoading && !isError && categories.length > 0 ? (
          <CategoryGrid categories={categories} />
        ) : null}
      </section>
    </div>
  );
}

export { CategoriesPageView };
