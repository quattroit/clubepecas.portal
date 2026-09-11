"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronRight,
  Eye,
  MessageCircle,
  Phone,
  SkipForward,
  Store,
} from "lucide-react";
import { toast } from "sonner";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { PageLoader } from "@/components/feedback/PageLoader";
import { RemoteImage } from "@/components/media/RemoteImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type {
  PartRequestSupplierContactSummaryDto,
  PartRequestSupplierDto,
} from "@/contracts/part-requests";
import {
  PartRequestStatus,
  PartRequestSupplierContactStatus,
} from "@/contracts/common/enums";
import { SupplierCompatibleAdsDialog } from "@/features/professional-buyer/components/SupplierCompatibleAdsDialog";
import {
  getSupplierContactStatusBadgeVariant,
  isSupplierContactPending,
} from "@/features/professional-buyer/utils/supplierContactStatus";
import { useContactPartRequestSupplier } from "@/hooks/api/useContactPartRequestSupplier";
import { usePartRequestSuppliers } from "@/hooks/api/usePartRequestSuppliers";
import { useSkipPartRequestSupplier } from "@/hooks/api/useSkipPartRequestSupplier";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { resolveMediaUrl } from "@/lib/photo-url";
import { cn } from "@/lib/utils";
import { formatCityLabel } from "@/mappers/city.mapper";
import { formatDate, formatTime } from "@/utils/formatDate";

type PartRequestSuppliersSectionProps = {
  partRequestId: number;
  status: PartRequestStatus;
  cityName?: string | null;
  cityState?: string | null;
};

function ContactSummaryBar({
  summary,
}: {
  summary: PartRequestSupplierContactSummaryDto;
}) {
  const metrics = [
    { label: "Selecionados", value: summary.selected },
    { label: "Contatados", value: summary.contacted },
    { label: "Pendentes", value: summary.pending },
    { label: "Ignorados", value: summary.skipped },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="border-border bg-muted/30 flex flex-col gap-0.5 rounded-xl border px-3 py-2"
        >
          <span className="text-label text-xs tracking-wide uppercase">
            {metric.label}
          </span>
          <span className="text-lg font-semibold tabular-nums">{metric.value}</span>
        </div>
      ))}
    </div>
  );
}

function SupplierAvatar({ supplier }: { supplier: PartRequestSupplierDto }) {
  const photoUrl = resolveMediaUrl(supplier.photoUrl);

  if (photoUrl) {
    return (
      <div className="bg-muted relative size-12 shrink-0 overflow-hidden rounded-xl">
        <RemoteImage src={photoUrl} alt="" fill className="object-cover" />
      </div>
    );
  }

  return (
    <div className="bg-muted text-muted-foreground flex size-12 shrink-0 items-center justify-center rounded-xl">
      <Store className="size-5" aria-hidden />
    </div>
  );
}

function SupplierContactDetails({
  supplier,
}: {
  supplier: PartRequestSupplierDto;
}) {
  const cityLabel = formatCityLabel({
    name: supplier.cityName,
    state: supplier.cityState,
  });

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <div className="flex flex-wrap items-center gap-2">
        <p className="truncate font-medium">{supplier.storeName}</p>
        <Badge variant={getSupplierContactStatusBadgeVariant(supplier.contactStatus)}>
          {supplier.contactStatusLabel}
        </Badge>
      </div>
      <p className="text-muted-foreground text-sm">{cityLabel}</p>
      <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <span className="inline-flex items-center gap-1.5">
          <Phone className="size-3.5 shrink-0" aria-hidden />
          {supplier.phone?.trim() || "—"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MessageCircle className="size-3.5 shrink-0" aria-hidden />
          {supplier.whatsApp?.trim() || "—"}
        </span>
      </div>
      {supplier.contactStatus === PartRequestSupplierContactStatus.Contacted &&
      supplier.contactedAt ? (
        <p className="text-muted-foreground text-sm">
          Contato realizado em: {formatDate(supplier.contactedAt)}{" "}
          {formatTime(supplier.contactedAt)}
        </p>
      ) : null}
    </div>
  );
}

function ReadOnlySupplierRow({ supplier }: { supplier: PartRequestSupplierDto }) {
  return (
    <li className="border-border flex items-center gap-3 rounded-xl border p-3">
      <SupplierAvatar supplier={supplier} />
      <SupplierContactDetails supplier={supplier} />
    </li>
  );
}

function SelectedSupplierContactRow({
  supplier,
  highlighted,
  rowRef,
  onPreview,
}: {
  supplier: PartRequestSupplierDto;
  highlighted: boolean;
  rowRef?: (node: HTMLElement | null) => void;
  onPreview: (supplier: PartRequestSupplierDto) => void;
}) {
  return (
    <li
      ref={rowRef}
      className={cn(
        "border-border flex items-center gap-3 rounded-xl border p-3 transition-colors",
        highlighted && "ring-primary ring-2 ring-offset-2",
      )}
    >
      <SupplierAvatar supplier={supplier} />
      <SupplierContactDetails supplier={supplier} />
      <Button
        type="button"
        variant="primary"
        size="sm"
        className="shrink-0"
        onClick={() => onPreview(supplier)}
      >
        <Eye className="size-3.5" aria-hidden />
        Ver peças
      </Button>
    </li>
  );
}

function PartRequestSuppliersSection({
  partRequestId,
  status,
  cityName,
  cityState,
}: PartRequestSuppliersSectionProps) {
  const isOpen = status === PartRequestStatus.Open;
  const isCancelled = status === PartRequestStatus.Cancelled;
  const cityLabel = cityName?.trim()
    ? formatCityLabel({ name: cityName, state: cityState ?? "" })
    : null;

  const suppliersQuery = usePartRequestSuppliers(
    partRequestId,
    status,
    isOpen || isCancelled,
  );
  const contactMutation = useContactPartRequestSupplier(partRequestId);
  const skipMutation = useSkipPartRequestSupplier(partRequestId);

  const [localItems, setLocalItems] = useState<PartRequestSupplierDto[]>([]);
  const [localSelectedCount, setLocalSelectedCount] = useState(0);
  const [localMaximumSuppliers, setLocalMaximumSuppliers] = useState(0);
  const [localContactSummary, setLocalContactSummary] =
    useState<PartRequestSupplierContactSummaryDto>({
      selected: 0,
      contacted: 0,
      pending: 0,
      skipped: 0,
    });
  const [previewSeller, setPreviewSeller] =
    useState<PartRequestSupplierDto | null>(null);
  const [localNextPendingSellerId, setLocalNextPendingSellerId] = useState<
    number | null
  >(null);

  const rowRefs = useRef<Map<number, HTMLElement>>(new Map());
  const [highlightSellerId, setHighlightSellerId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (!suppliersQuery.data) return;
    setLocalItems(suppliersQuery.data.items);
    setLocalSelectedCount(suppliersQuery.data.selectedCount);
    setLocalMaximumSuppliers(suppliersQuery.data.maximumSuppliers);
    setLocalContactSummary(suppliersQuery.data.contactSummary);
    setLocalNextPendingSellerId(suppliersQuery.data.nextPendingSellerId);
  }, [suppliersQuery.data]);

  const readOnlyItems = useMemo(
    () => localItems.filter((item) => item.selected),
    [localItems],
  );

  const selectedItems = useMemo(
    () =>
      [...localItems]
        .filter((item) => item.selected)
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [localItems],
  );

  const focusedSellerId = useMemo(() => {
    if (localNextPendingSellerId != null) {
      return localNextPendingSellerId;
    }

    const firstPending = selectedItems.find((item) =>
      isSupplierContactPending(item.contactStatus),
    );
    return firstPending?.sellerId ?? null;
  }, [localNextPendingSellerId, selectedItems]);

  const focusedSupplier = useMemo(
    () => selectedItems.find((item) => item.sellerId === focusedSellerId) ?? null,
    [focusedSellerId, selectedItems],
  );

  const isFocusedPending =
    focusedSupplier != null && isSupplierContactPending(focusedSupplier.contactStatus);

  const upcomingItems = useMemo(
    () =>
      isFocusedPending
        ? selectedItems.filter((item) => item.sellerId !== focusedSupplier.sellerId)
        : selectedItems,
    [isFocusedPending, selectedItems, focusedSupplier],
  );

  const scrollToSeller = useCallback((sellerId: number) => {
    const node = rowRefs.current.get(sellerId);
    if (!node) return;
    node.scrollIntoView({ behavior: "smooth", block: "nearest" });
    setHighlightSellerId(sellerId);
    window.setTimeout(() => setHighlightSellerId(null), 2000);
  }, []);

  const handleContact = (sellerId: number) => {
    contactMutation.mutate(sellerId, {
      onSuccess: (data) => {
        if (data.whatsAppUrl) {
          window.open(data.whatsAppUrl, "_blank", "noopener,noreferrer");
        }
        toast.success(`Contato iniciado com ${data.storeName}.`);
        if (data.nextPendingSellerId != null) {
          window.setTimeout(() => scrollToSeller(data.nextPendingSellerId!), 400);
        }
      },
      onError: (error) => {
        toast.error(getFriendlyErrorMessage(error));
      },
    });
  };

  const handleSkip = (sellerId: number) => {
    skipMutation.mutate(sellerId, {
      onSuccess: (data) => {
        toast.info("Fornecedor ignorado.");
        if (data.nextPendingSellerId != null) {
          window.setTimeout(() => scrollToSeller(data.nextPendingSellerId!), 400);
        }
      },
      onError: (error) => {
        toast.error(getFriendlyErrorMessage(error));
      },
    });
  };

  const handleGoToNextPending = () => {
    if (localNextPendingSellerId == null) return;
    scrollToSeller(localNextPendingSellerId);
    toast.message("Próximo fornecedor pendente.");
  };

  const setRowRef = useCallback(
    (sellerId: number) => (node: HTMLElement | null) => {
      if (node) {
        rowRefs.current.set(sellerId, node);
      } else {
        rowRefs.current.delete(sellerId);
      }
    },
    [],
  );

  const contactActionPending =
    contactMutation.isPending || skipMutation.isPending;

  if (!isOpen && !isCancelled) {
    return null;
  }

  return (
    <section className="border-border bg-surface flex flex-col gap-4 rounded-2xl border p-5 shadow-xs sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Fornecedores Compatíveis</h2>
          {isOpen ? (
            <p className="text-muted-foreground text-sm">
              {cityLabel
                ? `Buscando fornecedores em ${cityLabel}. Contate-os pelo WhatsApp ou pule para o próximo.`
                : "Contate os fornecedores pelo WhatsApp ou pule para o próximo."}
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">
              Fornecedores selecionados antes do cancelamento.
            </p>
          )}
        </div>
        {isOpen && suppliersQuery.data ? (
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-muted-foreground text-sm tabular-nums">
              Selecionados{" "}
              <span className="text-foreground font-medium">
                {localSelectedCount} / {localMaximumSuppliers}
              </span>
            </p>
            {localNextPendingSellerId != null ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGoToNextPending}
              >
                Próximo fornecedor
                <ChevronRight aria-hidden />
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>

      {isOpen && localSelectedCount > 0 ? (
        <ContactSummaryBar summary={localContactSummary} />
      ) : null}

      {suppliersQuery.isLoading ? (
        <PageLoader label="Carregando fornecedores…" />
      ) : null}

      {suppliersQuery.isError ? (
        <ErrorMessage
          title="Não foi possível carregar os fornecedores"
          message={getFriendlyErrorMessage(suppliersQuery.error)}
        />
      ) : null}

      {isOpen && suppliersQuery.data && localItems.length === 0 ? (
        <EmptyState
          title="Nenhum fornecedor encontrado"
          description={
            cityLabel
              ? `Não encontramos fornecedores em ${cityLabel} com anúncios compatíveis para este item. Tente outra cidade ou crie uma solicitação sem filtrar por cidade.`
              : "Não encontramos fornecedores com anúncios compatíveis para este item. Verifique a categoria e os dados do veículo."
          }
          icon={<Store aria-hidden />}
        />
      ) : null}

      {isOpen && selectedItems.length > 0 ? (
        <div className="flex flex-col gap-4">
          {localContactSummary.pending === 0 ? (
            <p className="text-muted-foreground rounded-xl border border-dashed px-4 py-3 text-sm">
              Todos os fornecedores já foram processados.
            </p>
          ) : null}

          {isFocusedPending ? (
            <div
              ref={setRowRef(focusedSupplier.sellerId)}
              className="border-primary/20 bg-primary/5 flex flex-col gap-3 rounded-xl border p-4"
            >
              <p className="text-sm font-medium">Fornecedor atual</p>
              <div className="flex items-start gap-3">
                <SupplierAvatar supplier={focusedSupplier} />
                <SupplierContactDetails supplier={focusedSupplier} />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => setPreviewSeller(focusedSupplier)}
                >
                  <Eye className="size-3.5" aria-hidden />
                  Ver peças
                </Button>
                <Button
                  type="button"
                  variant="whatsapp"
                  size="sm"
                  disabled={contactActionPending}
                  onClick={() => handleContact(focusedSupplier.sellerId)}
                >
                  <MessageCircle aria-hidden />
                  Contatar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={contactActionPending}
                  onClick={() => handleSkip(focusedSupplier.sellerId)}
                >
                  <SkipForward aria-hidden />
                  Pular
                </Button>
              </div>
            </div>
          ) : null}

          {upcomingItems.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {upcomingItems.map((supplier) => (
                <SelectedSupplierContactRow
                  key={supplier.sellerId}
                  supplier={supplier}
                  highlighted={highlightSellerId === supplier.sellerId}
                  rowRef={setRowRef(supplier.sellerId)}
                  onPreview={setPreviewSeller}
                />
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {isCancelled && readOnlyItems.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {readOnlyItems.map((supplier) => (
            <ReadOnlySupplierRow key={supplier.sellerId} supplier={supplier} />
          ))}
        </ul>
      ) : null}

      {isCancelled &&
      suppliersQuery.data &&
      readOnlyItems.length === 0 &&
      !suppliersQuery.isLoading ? (
        <EmptyState
          title="Nenhum fornecedor selecionado"
          description="Esta solicitação foi cancelada sem fornecedores selecionados."
          icon={<Store aria-hidden />}
        />
      ) : null}

      <SupplierCompatibleAdsDialog
        open={previewSeller !== null}
        partRequestId={partRequestId}
        sellerId={previewSeller?.sellerId ?? null}
        storeName={previewSeller?.storeName}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setPreviewSeller(null);
        }}
      />
    </section>
  );
}

export { PartRequestSuppliersSection };
