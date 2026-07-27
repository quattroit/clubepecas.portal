"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronRight,
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
import {
  getSupplierContactStatusBadgeVariant,
  isSupplierContactPending,
} from "@/features/professional-buyer/utils/supplierContactStatus";
import { useContactPartRequestSupplier } from "@/hooks/api/useContactPartRequestSupplier";
import { usePartRequestSuppliers } from "@/hooks/api/usePartRequestSuppliers";
import { useSkipPartRequestSupplier } from "@/hooks/api/useSkipPartRequestSupplier";
import { useUpdatePartRequestSuppliers } from "@/hooks/api/useUpdatePartRequestSuppliers";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { resolveMediaUrl } from "@/lib/photo-url";
import { cn } from "@/lib/utils";
import { formatCityLabel } from "@/mappers/city.mapper";
import { formatDate, formatTime } from "@/utils/formatDate";

type PartRequestSuppliersSectionProps = {
  partRequestId: number;
  status: PartRequestStatus;
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
          <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
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

function SupplierSelectionDetails({
  supplier,
}: {
  supplier: PartRequestSupplierDto;
}) {
  const cityLabel = formatCityLabel({
    name: supplier.cityName,
    state: supplier.cityState,
  });
  const adsLabel =
    supplier.compatibleAdvertisementCount === 1
      ? "1 anúncio compatível"
      : `${supplier.compatibleAdvertisementCount} anúncios compatíveis`;

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
      <p className="truncate font-medium">{supplier.storeName}</p>
      <p className="text-muted-foreground text-sm">{cityLabel}</p>
      <p className="text-muted-foreground text-sm">{adsLabel}</p>
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

function EditableSupplierRow({
  supplier,
  disabled,
  highlighted,
  rowRef,
  onToggle,
}: {
  supplier: PartRequestSupplierDto;
  disabled: boolean;
  highlighted: boolean;
  rowRef?: (node: HTMLLIElement | null) => void;
  onToggle: (sellerId: number, nextSelected: boolean) => void;
}) {
  return (
    <li
      ref={rowRef}
      className={cn(
        "border-border flex items-center gap-3 rounded-xl border p-3 transition-colors",
        supplier.selected && "border-primary/30 bg-primary/5",
        highlighted && "ring-primary ring-2 ring-offset-2",
      )}
    >
      <input
        type="checkbox"
        className="size-4 shrink-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
        checked={supplier.selected}
        disabled={disabled}
        aria-label={`Selecionar ${supplier.storeName}`}
        onChange={() => onToggle(supplier.sellerId, !supplier.selected)}
      />
      <SupplierAvatar supplier={supplier} />
      <SupplierSelectionDetails supplier={supplier} />
    </li>
  );
}

function SelectedSupplierContactRow({
  supplier,
  highlighted,
  rowRef,
}: {
  supplier: PartRequestSupplierDto;
  highlighted: boolean;
  rowRef?: (node: HTMLLIElement | null) => void;
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
    </li>
  );
}

function PartRequestSuppliersSection({
  partRequestId,
  status,
}: PartRequestSuppliersSectionProps) {
  const isOpen = status === PartRequestStatus.Open;
  const isCancelled = status === PartRequestStatus.Cancelled;

  const suppliersQuery = usePartRequestSuppliers(
    partRequestId,
    status,
    isOpen || isCancelled,
  );
  const updateMutation = useUpdatePartRequestSuppliers(partRequestId);
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
  const [localNextPendingSellerId, setLocalNextPendingSellerId] = useState<
    number | null
  >(null);

  const rowRefs = useRef<Map<number, HTMLLIElement>>(new Map());
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

  const scrollToSeller = useCallback((sellerId: number) => {
    const node = rowRefs.current.get(sellerId);
    if (!node) return;
    node.scrollIntoView({ behavior: "smooth", block: "nearest" });
    setHighlightSellerId(sellerId);
    window.setTimeout(() => setHighlightSellerId(null), 2000);
  }, []);

  const handleToggle = (sellerId: number, nextSelected: boolean) => {
    if (!isOpen || updateMutation.isPending) return;

    const currentSelectedIds = localItems
      .filter((item) => item.selected)
      .map((item) => item.sellerId);

    if (nextSelected && currentSelectedIds.length >= localMaximumSuppliers) {
      toast.warning(
        "Você atingiu o limite de fornecedores selecionados para esta solicitação.",
      );
      return;
    }

    const nextSelectedIds = nextSelected
      ? [...currentSelectedIds, sellerId]
      : currentSelectedIds.filter((id) => id !== sellerId);

    const previousItems = localItems;
    const previousSelectedCount = localSelectedCount;

    setLocalItems((items) =>
      items.map((item) =>
        item.sellerId === sellerId ? { ...item, selected: nextSelected } : item,
      ),
    );
    setLocalSelectedCount(nextSelectedIds.length);

    updateMutation.mutate(nextSelectedIds, {
      onSuccess: (data) => {
        setLocalItems(data.items);
        setLocalSelectedCount(data.selectedCount);
        setLocalMaximumSuppliers(data.maximumSuppliers);
        setLocalContactSummary(data.contactSummary);
        setLocalNextPendingSellerId(data.nextPendingSellerId);
      },
      onError: (error) => {
        setLocalItems(previousItems);
        setLocalSelectedCount(previousSelectedCount);
        toast.error(getFriendlyErrorMessage(error));
      },
    });
  };

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
    (sellerId: number) => (node: HTMLLIElement | null) => {
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
              Selecione até {localMaximumSuppliers} fornecedores e contate-os
              pelo WhatsApp.
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">
              Fornecedores selecionados antes do cancelamento.
            </p>
          )}
        </div>
        {isOpen && suppliersQuery.data ? (
          <p className="text-muted-foreground text-sm tabular-nums">
            Selecionados{" "}
            <span className="text-foreground font-medium">
              {localSelectedCount} / {localMaximumSuppliers}
            </span>
          </p>
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
          title="Nenhum fornecedor compatível"
          description="Ainda não há fornecedores com anúncios compatíveis para esta solicitação."
          icon={<Store aria-hidden />}
        />
      ) : null}

      {isOpen && localItems.length > 0 ? (
        <div className="flex flex-col gap-2">
          <h3 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Seleção de fornecedores
          </h3>
          <ul className="flex flex-col gap-2">
            {localItems.map((supplier) => (
              <EditableSupplierRow
                key={supplier.sellerId}
                supplier={supplier}
                disabled={updateMutation.isPending}
                highlighted={
                  highlightSellerId === supplier.sellerId ||
                  focusedSellerId === supplier.sellerId
                }
                rowRef={setRowRef(supplier.sellerId)}
                onToggle={handleToggle}
              />
            ))}
          </ul>
        </div>
      ) : null}

      {isOpen && selectedItems.length > 0 ? (
        <div className="border-border flex flex-col gap-4 border-t pt-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold">Contato com fornecedores</h3>
              <p className="text-muted-foreground text-sm">
                Contate os fornecedores selecionados pelo WhatsApp ou pule para
                o próximo.
              </p>
            </div>
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

          {localContactSummary.pending === 0 ? (
            <p className="text-muted-foreground rounded-xl border border-dashed px-4 py-3 text-sm">
              Todos os fornecedores selecionados já foram processados.
            </p>
          ) : null}

          {focusedSupplier &&
          isSupplierContactPending(focusedSupplier.contactStatus) ? (
            <div className="border-primary/20 bg-primary/5 flex flex-col gap-3 rounded-xl border p-4">
              <p className="text-sm font-medium">Fornecedor atual</p>
              <div className="flex items-start gap-3">
                <SupplierAvatar supplier={focusedSupplier} />
                <SupplierContactDetails supplier={focusedSupplier} />
              </div>
              <div className="flex flex-wrap gap-2">
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

          <ul className="flex flex-col gap-2">
            {selectedItems.map((supplier) => (
              <SelectedSupplierContactRow
                key={supplier.sellerId}
                supplier={supplier}
                highlighted={
                  highlightSellerId === supplier.sellerId ||
                  focusedSellerId === supplier.sellerId
                }
                rowRef={setRowRef(supplier.sellerId)}
              />
            ))}
          </ul>
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
    </section>
  );
}

export { PartRequestSuppliersSection };
