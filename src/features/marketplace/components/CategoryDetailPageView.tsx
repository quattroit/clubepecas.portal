"use client";

import { useParams } from "next/navigation";

import { Package } from "lucide-react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { NotFound } from "@/components/feedback/NotFound";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { Pagination } from "@/components/navigation/Pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { ROUTES } from "@/constants/routes";
import { AdvertisementGrid } from "@/features/marketplace";
import { AdvertisementGridSkeleton } from "@/features/marketplace/components/AdvertisementGridSkeleton";
import { AdvertisementsToolbar } from "@/features/marketplace/components/AdvertisementsToolbar";
import { FilterSidebar } from "@/features/marketplace/components/FilterSidebar";
import { useCategory } from "@/hooks/api/useCategory";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";

/**
 * Detalhe público /categorias/[slug] — mesma UI, anúncios via marketplace filtrado.
 */
function CategoryDetailPageView() {
  const params = useParams<{ slug: string }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const {
    category,
    categoryExists,
    advertisements,
    total,
    page,
    totalPages,
    categories,
    isLoading,
    isError,
    error,
  } = useCategory(slug ?? "");

  if (!isLoading && !categoryExists) {
    return (
      <NotFound
        title="Categoria não encontrada"
        description="Esta categoria não existe ou não está mais disponível."
        homeHref={ROUTES.CATEGORIES}
      />
    );
  }

  if (isError) {
    return (
      <ErrorMessage
        title="Não foi possível carregar a categoria"
        message={getFriendlyErrorMessage(error)}
      />
    );
  }

  const countLabel =
    total === 1
      ? "1 anúncio nesta categoria"
      : `${total} anúncios nesta categoria`;

  const filterCategories = [
    { id: "all", label: "Todas" },
    ...categories.map((item) => ({
      id: item.id,
      label: item.name,
    })),
  ];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "Home", href: ROUTES.HOME },
            { label: "Categorias", href: ROUTES.CATEGORIES },
            { label: category?.name ?? "Categoria" },
          ]}
        />
        <div className="flex max-w-2xl flex-col gap-2">
          <h1 className="text-h1">{category?.name ?? "Categoria"}</h1>
          <p className="text-small">
            {isLoading ? "Carregando anúncios…" : countLabel}
          </p>
          {category?.description ? (
            <p className="text-body text-muted-foreground">
              {category.description}
            </p>
          ) : null}
        </div>
      </header>

      <AdvertisementsToolbar />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <div className="hidden w-64 shrink-0 lg:block xl:w-72">
          <FilterSidebar categories={filterCategories} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <section aria-labelledby="category-ads-heading">
            <h2 id="category-ads-heading" className="sr-only">
              Anúncios em {category?.name ?? "categoria"}
            </h2>

            {isLoading ? <AdvertisementGridSkeleton /> : null}

            {!isLoading && advertisements.length > 0 ? (
              <AdvertisementGrid advertisements={advertisements} />
            ) : null}

            {!isLoading && advertisements.length === 0 ? (
              <EmptyState
                title="Nenhum anúncio nesta categoria"
                description="Não há anúncios disponíveis nesta categoria no momento."
                icon={<Package aria-hidden />}
              />
            ) : null}
          </section>

          {!isLoading && advertisements.length > 0 ? (
            <Pagination currentPage={page} totalPages={totalPages} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export { CategoryDetailPageView };
