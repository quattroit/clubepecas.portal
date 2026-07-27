"use client";

import { useEffect, useMemo, useState } from "react";
import { Store } from "lucide-react";
import { toast } from "sonner";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { PageLoader } from "@/components/feedback/PageLoader";
import { RemoteImage } from "@/components/media/RemoteImage";
import { EmptyState } from "@/components/ui/empty-state";
import type { PartRequestSupplierDto } from "@/contracts/part-requests";
import { PartRequestStatus } from "@/contracts/common/enums";
import { usePartRequestSuppliers } from "@/hooks/api/usePartRequestSuppliers";
import { useUpdatePartRequestSuppliers } from "@/hooks/api/useUpdatePartRequestSuppliers";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { resolveMediaUrl } from "@/lib/photo-url";
import { formatCityLabel } from "@/mappers/city.mapper";
import { cn } from "@/lib/utils";

type PartRequestSuppliersSectionProps = {
  partRequestId: number;
  status: PartRequestStatus;
};

function SupplierAvatar({ supplier }: { supplier: PartRequestSupplierDto }) {
  const photoUrl = resolveMediaUrl(supplier.photoUrl);

  if (photoUrl) {
    return (
      <div className="bg-muted relative size-12 shrink-0 overflow-hidden rounded-xl">
        <RemoteImage
          src={photoUrl}
          alt=""
          fill
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className="bg-muted text-muted-foreground flex size-12 shrink-0 items-center justify-center rounded-xl">
      <Store className="size-5" aria-hidden />
    </div>
  );
}

function SupplierDetails({ supplier }: { supplier: PartRequestSupplierDto }) {
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

function ReadOnlySupplierRow({ supplier }: { supplier: PartRequestSupplierDto }) {
  return (
    <li className="border-border flex items-center gap-3 rounded-xl border p-3">
      <SupplierAvatar supplier={supplier} />
      <SupplierDetails supplier={supplier} />
    </li>
  );
}

function EditableSupplierRow({
  supplier,
  disabled,
  onToggle,
}: {
  supplier: PartRequestSupplierDto;
  disabled: boolean;
  onToggle: (sellerId: number, nextSelected: boolean) => void;
}) {
  return (
    <li
      className={cn(
        "border-border flex items-center gap-3 rounded-xl border p-3 transition-colors",
        supplier.selected && "border-primary/30 bg-primary/5",
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
      <SupplierDetails supplier={supplier} />
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

  const [localItems, setLocalItems] = useState<PartRequestSupplierDto[]>([]);
  const [localSelectedCount, setLocalSelectedCount] = useState(0);
  const [localMaximumSuppliers, setLocalMaximumSuppliers] = useState(0);

  useEffect(() => {
    if (!suppliersQuery.data) return;
    setLocalItems(suppliersQuery.data.items);
    setLocalSelectedCount(suppliersQuery.data.selectedCount);
    setLocalMaximumSuppliers(suppliersQuery.data.maximumSuppliers);
  }, [suppliersQuery.data]);

  const readOnlyItems = useMemo(
    () => localItems.filter((item) => item.selected),
    [localItems],
  );

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
      },
      onError: (error) => {
        setLocalItems(previousItems);
        setLocalSelectedCount(previousSelectedCount);
        toast.error(getFriendlyErrorMessage(error));
      },
    });
  };

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
              Selecione até {localMaximumSuppliers} fornecedores para receber
              sua solicitação.
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
        <ul className="flex flex-col gap-2">
          {localItems.map((supplier) => (
            <EditableSupplierRow
              key={supplier.sellerId}
              supplier={supplier}
              disabled={updateMutation.isPending}
              onToggle={handleToggle}
            />
          ))}
        </ul>
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
