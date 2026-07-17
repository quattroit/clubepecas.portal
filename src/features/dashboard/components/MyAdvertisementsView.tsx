"use client";

import { useState } from "react";
import Link from "next/link";
import { PackagePlus } from "lucide-react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { DeleteAdvertisementDialog } from "@/features/dashboard/components/DeleteAdvertisementDialog";
import { MyAdvertisementCard } from "@/features/dashboard/components/MyAdvertisementCard";
import { MyAdvertisementsSkeleton } from "@/features/dashboard/components/MyAdvertisementsSkeleton";
import { ROUTES } from "@/constants/routes";
import { useMyAdvertisements } from "@/hooks/api/useMyAdvertisements";
import { useDeleteAdvertisement } from "@/hooks/api/useDeleteAdvertisement";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import type { Advertisement } from "@/types/Advertisement";

function MyAdvertisementsView() {
  const { data, isLoading, isError, error } = useMyAdvertisements();
  const deleteMutation = useDeleteAdvertisement();
  const [pendingDelete, setPendingDelete] = useState<Advertisement | null>(
    null,
  );

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;

    deleteMutation.mutate(pendingDelete.id, {
      onSuccess: () => setPendingDelete(null),
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-h1">Meus anúncios</h1>
          <p className="text-small text-muted-foreground">
            Gerencie as peças que você anunciou na plataforma.
          </p>
        </div>

        <Link
          href={ROUTES.NEW_ADVERTISEMENT}
          className={cn(
            buttonVariants({ variant: "default", size: "sm" }),
            "shrink-0",
          )}
        >
          <PackagePlus aria-hidden />
          Nova peça
        </Link>
      </div>

      {isLoading ? <MyAdvertisementsSkeleton /> : null}

      {isError ? (
        <ErrorMessage
          title="Não foi possível carregar seus anúncios"
          message={getFriendlyErrorMessage(error)}
        />
      ) : null}

      {!isLoading && !isError && data && data.length === 0 ? (
        <EmptyState
          title="Você ainda não tem anúncios"
          description="Publique sua primeira peça e comece a vender no ClubePeças."
          icon={<PackagePlus aria-hidden />}
          action={
            <Link
              href={ROUTES.NEW_ADVERTISEMENT}
              className={cn(buttonVariants({ variant: "default" }))}
            >
              Criar primeiro anúncio
            </Link>
          }
        />
      ) : null}

      {!isLoading && !isError && data && data.length > 0 ? (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {data.map((advertisement) => (
            <li key={advertisement.id}>
              <MyAdvertisementCard
                advertisement={advertisement}
                onDeleteClick={setPendingDelete}
                isDeleting={
                  deleteMutation.isPending &&
                  pendingDelete?.id === advertisement.id
                }
              />
            </li>
          ))}
        </ul>
      ) : null}

      <DeleteAdvertisementDialog
        open={Boolean(pendingDelete)}
        advertisementTitle={pendingDelete?.title}
        isDeleting={deleteMutation.isPending}
        onOpenChange={(open) => {
          if (!open && !deleteMutation.isPending) {
            setPendingDelete(null);
            deleteMutation.reset();
          }
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export { MyAdvertisementsView };
