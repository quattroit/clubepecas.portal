"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { RemoteImage } from "@/components/media/RemoteImage";
import {
  Eye,
  ExternalLink,
  MessageCircle,
  Package,
  Percent,
  Flag,
} from "lucide-react";

import {
  AdminCard,
  AdminEmptyState,
  AdminFilterBar,
  AdminMetricCard,
  AdminMetricCardSkeleton,
  AdminPage,
  AdminSection,
  AdminStatsGrid,
  AdminStatusBadge,
  ConfirmDialog,
} from "@/components/admin";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  adminAdvertisementPath,
  adminSellerPath,
  advertisementPath,
  ROUTES,
  storePath,
} from "@/constants/routes";
import type { MetricsPeriodParam } from "@/contracts/admin/advertisements";
import { AdvertisementStatus } from "@/contracts/common/enums";
import { useAdminAdvertisement } from "@/hooks/api/useAdminAdvertisement";
import { useUpdateAdminAdvertisementStatus } from "@/hooks/api/useUpdateAdminAdvertisementStatus";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import { getConditionLabel, getStatusLabel } from "@/mappers/categoryMeta";
import { formatDate } from "@/utils/formatDate";
import {
  formatConversionRate,
  formatMetricCount,
} from "@/utils/formatMetrics";
import { formatVehicleYears } from "@/utils/vehicle-years";

const PERIOD_OPTIONS: { value: MetricsPeriodParam; label: string }[] = [
  { value: "7d", label: "7 dias" },
  { value: "30d", label: "30 dias" },
  { value: "90d", label: "90 dias" },
  { value: "all", label: "Todo período" },
];

function parsePeriod(value: string | null): MetricsPeriodParam {
  if (value === "7d" || value === "30d" || value === "90d" || value === "all") {
    return value;
  }
  return "all";
}

function advertisementStatusVariant(
  status: AdvertisementStatus,
): "active" | "inactive" | "pending" | "blocked" | "default" {
  switch (status) {
    case AdvertisementStatus.Published:
      return "active";
    case AdvertisementStatus.Paused:
      return "pending";
    case AdvertisementStatus.Sold:
      return "inactive";
    case AdvertisementStatus.Archived:
      return "blocked";
    default:
      return "default";
  }
}

function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/**
 * Detalhes administrativos do anúncio — métricas em uma chamada.
 */
function AdminAdvertisementDetailView() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const advertisementId = params.id;
  const period = parsePeriod(searchParams.get("period"));

  const adQuery = useAdminAdvertisement(advertisementId, period);
  const updateStatus = useUpdateAdminAdvertisementStatus();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const data = adQuery.data;

  const setPeriod = (next: MetricsPeriodParam) => {
    const query = new URLSearchParams(searchParams.toString());
    if (next === "all") {
      query.delete("period");
    } else {
      query.set("period", next);
    }
    const qs = query.toString();
    router.push(
      qs
        ? `${adminAdvertisementPath(advertisementId)}?${qs}`
        : adminAdvertisementPath(advertisementId),
    );
  };

  if (adQuery.isError) {
    return (
      <AdminPage
        title="Anúncio"
        breadcrumb={[
          { label: "Admin", href: ROUTES.ADMIN },
          { label: "Anúncios", href: ROUTES.ADMIN_ADVERTISEMENTS },
          { label: "Detalhes" },
        ]}
      >
        <AdminCard>
          <AdminEmptyState
            title="Não foi possível carregar o anúncio"
            description={getFriendlyErrorMessage(adQuery.error)}
            icon={<Package aria-hidden />}
            action={
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    void adQuery.refetch();
                  }}
                >
                  Tentar novamente
                </Button>
                <Link
                  href={ROUTES.ADMIN_ADVERTISEMENTS}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                  )}
                >
                  Voltar à listagem
                </Link>
              </div>
            }
          />
        </AdminCard>
      </AdminPage>
    );
  }

  return (
    <AdminPage
      title={data?.title ?? "Anúncio"}
      description={
        data
          ? `${data.categoryName} · ${data.storeName}`
          : "Carregando detalhes…"
      }
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Anúncios", href: ROUTES.ADMIN_ADVERTISEMENTS },
        { label: data?.title ?? "Detalhes" },
      ]}
      actions={
        data ? (
          <div className="flex flex-wrap gap-2">
            <Link
              href={advertisementPath(data.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              <ExternalLink className="size-3.5" aria-hidden />
              Abrir anúncio público
            </Link>
            <Button
              type="button"
              variant={data.isActive ? "destructive" : "primary"}
              size="sm"
              onClick={() => setConfirmOpen(true)}
            >
              {data.isActive ? "Inativar" : "Ativar"}
            </Button>
          </div>
        ) : null
      }
    >
      <AdminFilterBar
        period={
          <div
            role="group"
            aria-label="Período das métricas"
            className="bg-muted/60 flex flex-wrap gap-1 rounded-xl p-1"
          >
            {PERIOD_OPTIONS.map((option) => {
              const selected = period === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={selected}
                  className={cn(
                    "focus-visible:ring-ring rounded-lg px-3 py-1.5 text-xs font-medium transition-colors outline-none focus-visible:ring-2",
                    selected
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  onClick={() => setPeriod(option.value)}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        }
      />

      <AdminSection title="Indicadores do período">
        {adQuery.isLoading ? (
          <AdminStatsGrid aria-label="Carregando indicadores">
            {Array.from({ length: 4 }).map((_, index) => (
              <AdminMetricCardSkeleton key={index} />
            ))}
          </AdminStatsGrid>
        ) : data ? (
          <AdminStatsGrid aria-label="Indicadores do anúncio">
            <AdminMetricCard
              title="Visualizações"
              value={formatMetricCount(data.views)}
              icon={<Eye className="size-4" />}
            />
            <AdminMetricCard
              title="Cliques WhatsApp"
              value={formatMetricCount(data.whatsappClicks)}
              icon={<MessageCircle className="size-4" />}
            />
            <AdminMetricCard
              title="Conversão"
              value={formatConversionRate(data.conversionRate)}
              icon={<Percent className="size-4" />}
            />
            <AdminMetricCard
              title="Denúncias"
              value={formatMetricCount(data.reportCount)}
              icon={<Flag className="size-4" />}
              description="Estrutura preparada para moderação"
            />
          </AdminStatsGrid>
        ) : null}
      </AdminSection>

      <AdminSection title="Galeria">
        {adQuery.isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-muted aspect-square animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : data && data.imageUrls.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {data.imageUrls.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="bg-muted relative aspect-square overflow-hidden rounded-xl"
              >
                <RemoteImage
                  src={url}
                  alt={`Foto ${index + 1} de ${data.title}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <AdminCard>
            <AdminEmptyState
              title="Sem imagens"
              description="Este anúncio ainda não possui fotos."
              icon={<Package aria-hidden />}
            />
          </AdminCard>
        )}
      </AdminSection>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AdminSection title="Dados do anúncio">
          {adQuery.isLoading ? (
            <AdminCard>
              <div className="bg-muted h-40 animate-pulse rounded-lg" />
            </AdminCard>
          ) : data ? (
            <AdminCard>
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground text-xs">Título</dt>
                  <dd className="text-sm font-medium">{data.title}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">Categoria</dt>
                  <dd className="text-sm">{data.categoryName}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">Marca</dt>
                  <dd className="text-sm">{data.vehicleBrandName}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">Modelo</dt>
                  <dd className="text-sm">{data.vehicleModelName || "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">Ano</dt>
                  <dd className="text-sm tabular-nums">
                    {formatVehicleYears(
                      data.manufacturingYear,
                      data.modelYear,
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">Condição</dt>
                  <dd className="text-sm">{getConditionLabel(data.condition)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">Preço</dt>
                  <dd className="text-sm tabular-nums">
                    {formatPrice(data.price)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">Estoque</dt>
                  <dd className="text-sm tabular-nums">
                    {formatMetricCount(data.stockQuantity)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">Status</dt>
                  <dd className="mt-1">
                    <AdminStatusBadge
                      status={advertisementStatusVariant(data.status)}
                      label={getStatusLabel(data.status)}
                    />
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">Publicação</dt>
                  <dd className="text-sm">{formatDate(data.publishedAt)}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground text-xs">Slug</dt>
                  <dd className="text-sm font-mono">{data.slug}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground text-xs">
                    Compatibilidade
                  </dt>
                  <dd className="text-muted-foreground text-sm whitespace-pre-wrap">
                    {data.compatibilityDescription || "—"}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground text-xs">Descrição</dt>
                  <dd className="text-muted-foreground text-sm whitespace-pre-wrap">
                    {data.description || "—"}
                  </dd>
                </div>
              </dl>
            </AdminCard>
          ) : null}
        </AdminSection>

        <AdminSection title="Loja">
          {adQuery.isLoading ? (
            <AdminCard>
              <div className="bg-muted h-40 animate-pulse rounded-lg" />
            </AdminCard>
          ) : data ? (
            <AdminCard
              footer={
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={adminSellerPath(data.sellerId)}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                    )}
                  >
                    Ver vendedor
                  </Link>
                  {data.storeSlug ? (
                    <Link
                      href={storePath(data.storeSlug)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                      )}
                    >
                      Loja pública
                    </Link>
                  ) : null}
                </div>
              }
            >
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground text-xs">Nome da loja</dt>
                  <dd className="text-sm font-medium">{data.storeName}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">Proprietário</dt>
                  <dd className="text-sm">{data.ownerName}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">WhatsApp</dt>
                  <dd className="text-sm tabular-nums">{data.whatsApp || "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">Cidade</dt>
                  <dd className="text-sm">{data.city || "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">Estado</dt>
                  <dd className="text-sm">{data.state || "—"}</dd>
                </div>
              </dl>
            </AdminCard>
          ) : null}
        </AdminSection>
      </div>

      {data ? (
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title={data.isActive ? "Inativar anúncio?" : "Ativar anúncio?"}
          description={
            data.isActive
              ? `O anúncio “${data.title}” deixará de aparecer no marketplace.`
              : `O anúncio “${data.title}” voltará a aparecer no marketplace.`
          }
          confirmLabel={data.isActive ? "Inativar" : "Ativar"}
          confirmVariant={data.isActive ? "destructive" : "primary"}
          loading={updateStatus.isPending}
          onConfirm={() => {
            updateStatus.mutate(
              { id: data.id, isActive: !data.isActive },
              { onSuccess: () => setConfirmOpen(false) },
            );
          }}
        />
      ) : null}
    </AdminPage>
  );
}

export { AdminAdvertisementDetailView };
