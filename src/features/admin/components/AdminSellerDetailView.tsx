"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { RemoteImage } from "@/components/media/RemoteImage";
import {
  Eye,
  MessageCircle,
  Package,
  Percent,
  Store,
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
  AdminTable,
  ConfirmDialog,
} from "@/components/admin";
import type { AdminTableColumn } from "@/components/admin";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  adminSellerPath,
  advertisementPath,
  ROUTES,
  storePath,
} from "@/constants/routes";
import type {
  AdminSellerAdvertisementDto,
  MetricsPeriodParam,
} from "@/contracts/admin/sellers";
import { AdvertisementStatus } from "@/contracts/common/enums";
import { useAdminSeller } from "@/hooks/api/useAdminSeller";
import { useUpdateAdminSellerStatus } from "@/hooks/api/useUpdateAdminSellerStatus";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import { getStatusLabel } from "@/mappers/categoryMeta";
import { formatDate } from "@/utils/formatDate";
import {
  formatConversionRate,
  formatMetricCount,
} from "@/utils/formatMetrics";
import { parseRouteId } from "@/utils/parseRouteId";

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

function formatDateTime(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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

/**
 * Detalhes administrativos do vendedor — métricas e anúncios em uma chamada.
 */
function AdminSellerDetailView() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sellerId = parseRouteId(params.id);
  const period = parsePeriod(searchParams.get("period"));

  const sellerQuery = useAdminSeller(sellerId ?? 0, period);
  const updateStatus = useUpdateAdminSellerStatus();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const data = sellerQuery.data;

  const setPeriod = (next: MetricsPeriodParam) => {
    if (!sellerId) return;
    const query = new URLSearchParams(searchParams.toString());
    if (next === "all") {
      query.delete("period");
    } else {
      query.set("period", next);
    }
    const qs = query.toString();
    router.push(
      qs
        ? `${adminSellerPath(sellerId)}?${qs}`
        : adminSellerPath(sellerId),
    );
  };

  const adColumns: AdminTableColumn<AdminSellerAdvertisementDto>[] = useMemo(
    () => [
      {
        id: "image",
        header: "Imagem",
        cell: (row) => (
          <div className="bg-muted relative size-12 overflow-hidden rounded-lg">
            {row.thumbnailUrl ? (
              <RemoteImage
                src={row.thumbnailUrl}
                alt=""
                fill
                sizes="48px"
                className="object-cover"
              />
            ) : (
              <div className="text-muted-foreground flex size-full items-center justify-center">
                <Package className="size-4" aria-hidden />
              </div>
            )}
          </div>
        ),
      },
      {
        id: "title",
        header: "Título",
        cell: (row) => (
          <Link
            href={advertisementPath(row.slug)}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary font-medium underline-offset-2 hover:underline"
          >
            {row.title}
          </Link>
        ),
      },
      {
        id: "category",
        header: "Categoria",
        accessor: (row) => row.categoryName,
      },
      {
        id: "stock",
        header: "Estoque",
        accessor: (row) => formatMetricCount(row.stockQuantity),
        className: "tabular-nums",
      },
      {
        id: "status",
        header: "Status",
        cell: (row) => (
          <AdminStatusBadge
            status={advertisementStatusVariant(row.status)}
            label={getStatusLabel(row.status)}
          />
        ),
      },
      {
        id: "views",
        header: "Views",
        accessor: (row) => formatMetricCount(row.views),
        className: "tabular-nums",
      },
      {
        id: "clicks",
        header: "WhatsApp",
        accessor: (row) => formatMetricCount(row.whatsappClicks),
        className: "tabular-nums",
      },
      {
        id: "conversion",
        header: "Conversão",
        accessor: (row) => formatConversionRate(row.conversionRate),
        className: "tabular-nums",
      },
    ],
    [],
  );

  if (sellerQuery.isError) {
    return (
      <AdminPage
        title="Vendedor"
        breadcrumb={[
          { label: "Admin", href: ROUTES.ADMIN },
          { label: "Vendedores", href: ROUTES.ADMIN_SELLERS },
          { label: "Detalhes" },
        ]}
      >
        <AdminCard>
          <AdminEmptyState
            title="Não foi possível carregar o vendedor"
            description={getFriendlyErrorMessage(sellerQuery.error)}
            icon={<Store aria-hidden />}
            action={
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    void sellerQuery.refetch();
                  }}
                >
                  Tentar novamente
                </Button>
                <Link
                  href={ROUTES.ADMIN_SELLERS}
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
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
      title={data?.storeName ?? "Vendedor"}
      description={
        data
          ? `${data.displayName} · ${data.city} — ${data.state}`
          : "Carregando detalhes…"
      }
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Vendedores", href: ROUTES.ADMIN_SELLERS },
        { label: data?.storeName ?? "Detalhes" },
      ]}
      actions={
        data ? (
          <div className="flex flex-wrap gap-2">
            <Link
              href={storePath(data.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Ver loja pública
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
        {sellerQuery.isLoading ? (
          <AdminStatsGrid aria-label="Carregando indicadores">
            {Array.from({ length: 4 }).map((_, index) => (
              <AdminMetricCardSkeleton key={index} />
            ))}
          </AdminStatsGrid>
        ) : data ? (
          <AdminStatsGrid aria-label="Indicadores do vendedor">
            <AdminMetricCard
              title="Anúncios"
              value={formatMetricCount(data.advertisementCount)}
              icon={<Package className="size-4" />}
            />
            <AdminMetricCard
              title="Visualizações"
              value={formatMetricCount(data.views)}
              icon={<Eye className="size-4" />}
              description="Loja e anúncios"
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
          </AdminStatsGrid>
        ) : null}
      </AdminSection>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AdminSection title="Dados do usuário">
          {sellerQuery.isLoading ? (
            <AdminCard>
              <div className="bg-muted h-32 animate-pulse rounded-lg" />
            </AdminCard>
          ) : data ? (
            <AdminCard>
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground text-xs">Proprietário</dt>
                  <dd className="text-sm font-medium">{data.displayName}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">E-mail</dt>
                  <dd className="text-sm break-all">{data.email}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">Último acesso</dt>
                  <dd className="text-sm tabular-nums">
                    {formatDateTime(data.lastAccessAt)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">Cadastro</dt>
                  <dd className="text-sm">{formatDate(data.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">Status</dt>
                  <dd className="mt-1">
                    <AdminStatusBadge
                      status={data.isActive ? "active" : "inactive"}
                    />
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">Plano</dt>
                  <dd className="mt-1">
                    <AdminStatusBadge status="basic" label={data.planLabel} />
                  </dd>
                </div>
              </dl>
            </AdminCard>
          ) : null}
        </AdminSection>

        <AdminSection title="Financeiro (somente leitura)">
          {sellerQuery.isLoading ? (
            <AdminCard>
              <div className="bg-muted h-24 animate-pulse rounded-lg" />
            </AdminCard>
          ) : data ? (
            <AdminCard>
              {data.financial ? (
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-muted-foreground text-xs">Provedor</dt>
                    <dd className="text-sm font-medium">
                      {data.financial.provider === 1
                        ? "Asaas"
                        : data.financial.provider === 0
                          ? "Nenhum"
                          : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground text-xs">
                      Status da assinatura
                    </dt>
                    <dd className="text-sm">
                      {data.financial.subscriptionStatus === 1
                        ? "Ativa"
                        : data.financial.subscriptionStatus === 4
                          ? "Pendente (checkout)"
                          : data.financial.subscriptionStatus === 2
                            ? "Cancelada"
                            : data.financial.subscriptionStatus === 3
                              ? "Expirada"
                              : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground text-xs">
                      Status do pagamento
                    </dt>
                    <dd className="text-sm">
                      {data.financial.currentPaymentStatus === 1
                        ? "Pendente"
                        : data.financial.currentPaymentStatus === 3
                          ? "Pago"
                          : data.financial.currentPaymentStatus != null
                            ? String(data.financial.currentPaymentStatus)
                            : "—"}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-muted-foreground text-xs">
                      External Customer ID
                    </dt>
                    <dd className="text-sm break-all font-mono">
                      {data.financial.externalCustomerId ?? "—"}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-muted-foreground text-xs">
                      External Subscription ID
                    </dt>
                    <dd className="text-sm break-all font-mono">
                      {data.financial.externalSubscriptionId ?? "—"}
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Nenhuma assinatura ou checkout registrado para este vendedor.
                </p>
              )}
            </AdminCard>
          ) : null}
        </AdminSection>

        <AdminSection title="Dados da loja">
          {sellerQuery.isLoading ? (
            <AdminCard>
              <div className="bg-muted h-32 animate-pulse rounded-lg" />
            </AdminCard>
          ) : data ? (
            <AdminCard>
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground text-xs">Nome da loja</dt>
                  <dd className="text-sm font-medium">{data.storeName}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">Cidade</dt>
                  <dd className="text-sm">{data.city}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">Estado</dt>
                  <dd className="text-sm">{data.state}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">WhatsApp</dt>
                  <dd className="text-sm tabular-nums">{data.whatsApp}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">Tipo de Pessoa</dt>
                  <dd className="text-sm">
                    {data.personType === 2
                      ? "Pessoa Jurídica"
                      : data.personType === 1
                        ? "Pessoa Física"
                        : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">CPF/CNPJ</dt>
                  <dd className="text-sm font-mono tabular-nums">
                    {data.document ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">Instagram</dt>
                  <dd className="text-sm">
                    {data.instagram ? data.instagram : "—"}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground text-xs">Slug</dt>
                  <dd className="text-sm font-mono">{data.slug}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground text-xs">Descrição</dt>
                  <dd className="text-muted-foreground text-sm whitespace-pre-wrap">
                    {data.description?.trim() || "—"}
                  </dd>
                </div>
              </dl>
            </AdminCard>
          ) : null}
        </AdminSection>
      </div>

      <AdminSection
        title="Anúncios"
        description="Anúncios do vendedor com métricas do período selecionado."
      >
        <AdminTable
          columns={adColumns}
          data={data?.advertisements ?? []}
          getRowId={(row) => row.id}
          loading={sellerQuery.isLoading}
          caption="Anúncios do vendedor"
          emptyTitle="Nenhum anúncio"
          emptyDescription="Este vendedor ainda não possui anúncios cadastrados."
        />
      </AdminSection>

      {data ? (
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title={data.isActive ? "Inativar vendedor?" : "Ativar vendedor?"}
          description={
            data.isActive
              ? `A loja “${data.storeName}” ficará inativa no marketplace.`
              : `A loja “${data.storeName}” voltará a aparecer no marketplace.`
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

export { AdminSellerDetailView };
