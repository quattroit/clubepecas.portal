"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Store } from "lucide-react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SellerProfileForm } from "@/features/dashboard/components/SellerProfileForm";
import { SellerProfileSkeleton } from "@/features/dashboard/components/SellerProfileSkeleton";
import type { SellerProfileFormValues } from "@/features/dashboard/schemas/sellerProfileFormSchema";
import { ROUTES } from "@/constants/routes";
import { useCreateSeller } from "@/hooks/api/useCreateSeller";
import { useSeller } from "@/hooks/api/useSeller";
import { useUpdateSeller } from "@/hooks/api/useUpdateSeller";
import { ANNOUNCE_PROFILE_PARAM } from "@/lib/announce-flow";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import {
  mapSellerProfileFormToCreateRequest,
  mapSellerProfileFormToUpdateRequest,
  mapSellerToProfileFormValues,
} from "@/mappers/seller-form.mapper";

function SellerProfileView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromAnnounce = searchParams.get(ANNOUNCE_PROFILE_PARAM) === "1";

  const sellerQuery = useSeller();
  const createMutation = useCreateSeller();
  const updateMutation = useUpdateSeller();
  const [isCreating, setIsCreating] = useState(false);
  const [dismissedAnnounceForm, setDismissedAnnounceForm] = useState(false);

  const showCreateForm =
    !sellerQuery.isLoading &&
    !sellerQuery.isError &&
    sellerQuery.data === null &&
    (isCreating || (fromAnnounce && !dismissedAnnounceForm));

  const editDefaults = useMemo(() => {
    if (!sellerQuery.data) return undefined;
    return mapSellerToProfileFormValues(sellerQuery.data);
  }, [sellerQuery.data]);

  const handleCreate = (values: SellerProfileFormValues) => {
    createMutation.mutate(mapSellerProfileFormToCreateRequest(values), {
      onSuccess: () => {
        setIsCreating(false);
        if (fromAnnounce) {
          router.replace(ROUTES.NEW_ADVERTISEMENT);
        }
      },
    });
  };

  const handleUpdate = (values: SellerProfileFormValues) => {
    updateMutation.mutate(mapSellerProfileFormToUpdateRequest(values));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-h1">Meu perfil</h1>
        <p className="text-small text-muted-foreground">
          Gerencie os dados da sua loja para anunciar peças no ClubePeças.
        </p>
      </div>

      {fromAnnounce && sellerQuery.data === null ? (
        <div
          role="status"
          className="border-border bg-secondary text-secondary-foreground rounded-lg border px-4 py-3"
        >
          <p className="text-small">
            Antes de publicar sua primeira peça, complete seu perfil de
            vendedor.
          </p>
        </div>
      ) : null}

      {sellerQuery.isLoading ? <SellerProfileSkeleton /> : null}

      {sellerQuery.isError ? (
        <ErrorMessage
          title="Não foi possível carregar o perfil"
          message={getFriendlyErrorMessage(sellerQuery.error)}
        />
      ) : null}

      {!sellerQuery.isLoading &&
      !sellerQuery.isError &&
      sellerQuery.data === null &&
      !showCreateForm ? (
        <EmptyState
          title="Você ainda não tem perfil de vendedor"
          description="Crie seu perfil de loja para poder publicar anúncios de peças no ClubePeças."
          icon={<Store aria-hidden />}
          action={
            <Button
              type="button"
              variant="primary"
              onClick={() => setIsCreating(true)}
            >
              Criar perfil
            </Button>
          }
        />
      ) : null}

      {showCreateForm ? (
        <SellerProfileForm
          mode="create"
          isSubmitting={createMutation.isPending}
          submitError={
            createMutation.isError ? createMutation.error : undefined
          }
          onSubmit={handleCreate}
          onCancel={() => {
            setIsCreating(false);
            setDismissedAnnounceForm(true);
            createMutation.reset();
          }}
        />
      ) : null}

      {!sellerQuery.isLoading &&
      !sellerQuery.isError &&
      sellerQuery.data ? (
        <SellerProfileForm
          key={sellerQuery.data.id}
          mode="edit"
          defaultValues={editDefaults}
          isSubmitting={updateMutation.isPending}
          submitError={
            updateMutation.isError ? updateMutation.error : undefined
          }
          onSubmit={handleUpdate}
        />
      ) : null}
    </div>
  );
}

export { SellerProfileView };
