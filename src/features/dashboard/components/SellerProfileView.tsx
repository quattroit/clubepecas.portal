"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { SellerProfileForm } from "@/features/dashboard/components/SellerProfileForm";
import { ChangePasswordForm } from "@/features/dashboard/components/ChangePasswordForm";
import { SellerProfileSkeleton } from "@/features/dashboard/components/SellerProfileSkeleton";
import type { SellerProfileFormValues } from "@/features/dashboard/schemas/sellerProfileFormSchema";
import { useCreateSeller } from "@/hooks/api/useCreateSeller";
import { useCurrentUser } from "@/hooks/api/useCurrentUser";
import { useSeller } from "@/hooks/api/useSeller";
import { useUpdateSeller } from "@/hooks/api/useUpdateSeller";
import { ANNOUNCE_PROFILE_PARAM } from "@/lib/announce-flow";
import { SELLER_ONBOARDING_PLAN_PATH } from "@/lib/seller-onboarding";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import {
  mapSellerProfileFormToCreateRequest,
  mapSellerProfileFormToUpdateRequest,
  mapSellerToProfileFormValues,
} from "@/mappers/seller-form.mapper";
import { PersonType } from "@/contracts/common/enums";
import {
  formatDocumentInput,
  inferPersonTypeFromDocument,
} from "@/utils/document";

function SellerProfileView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromAnnounce = searchParams.get(ANNOUNCE_PROFILE_PARAM) === "1";

  const sellerQuery = useSeller();
  const currentUserQuery = useCurrentUser();
  const createMutation = useCreateSeller();
  const updateMutation = useUpdateSeller();
  const [pendingPhotoFile, setPendingPhotoFile] = useState<File | null>(null);
  const [pendingCoverFile, setPendingCoverFile] = useState<File | null>(null);

  const createDefaults = useMemo(() => {
    const document = currentUserQuery.data?.document?.trim();
    if (!document) return undefined;

    const personType =
      (currentUserQuery.data?.personType as PersonType | null | undefined) ??
      inferPersonTypeFromDocument(document) ??
      PersonType.Individual;

    return {
      personType,
      document: formatDocumentInput(document, personType),
    };
  }, [currentUserQuery.data?.document, currentUserQuery.data?.personType]);

  const showCreateForm =
    !sellerQuery.isLoading &&
    !sellerQuery.isError &&
    sellerQuery.data === null;

  const editDefaults = useMemo(() => {
    if (!sellerQuery.data) return undefined;
    return mapSellerToProfileFormValues(sellerQuery.data);
  }, [sellerQuery.data]);

  const handleCreate = (values: SellerProfileFormValues) => {
    createMutation.mutate(
      {
        request: mapSellerProfileFormToCreateRequest({
          ...values,
          photoUrl: "",
        }),
        photoFile: pendingPhotoFile,
        coverFile: pendingCoverFile,
      },
      {
        onSuccess: () => {
          setPendingPhotoFile(null);
          setPendingCoverFile(null);
          router.replace(SELLER_ONBOARDING_PLAN_PATH);
        },
      },
    );
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

      {showCreateForm ? (
        <div
          role="status"
          className="border-border bg-secondary text-secondary-foreground rounded-lg border px-4 py-3"
        >
          <p className="text-small">
            {fromAnnounce
              ? "Antes de publicar peças, complete o perfil da loja e assine um plano."
              : "Complete o perfil da sua loja para continuar. Em seguida você poderá escolher um plano."}
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

      {showCreateForm ? (
        <SellerProfileForm
          mode="create"
          defaultValues={createDefaults}
          isSubmitting={createMutation.isPending}
          submitError={
            createMutation.isError ? createMutation.error : undefined
          }
          pendingPhotoFile={pendingPhotoFile}
          onPendingPhotoFileChange={setPendingPhotoFile}
          pendingCoverFile={pendingCoverFile}
          onPendingCoverFileChange={setPendingCoverFile}
          onSubmit={handleCreate}
          submittingLabel={
            pendingPhotoFile || pendingCoverFile
              ? "Criando e enviando imagens…"
              : undefined
          }
        />
      ) : null}

      {!sellerQuery.isLoading &&
      !sellerQuery.isError &&
      sellerQuery.data ? (
        <>
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
          <ChangePasswordForm />
        </>
      ) : null}
    </div>
  );
}

export { SellerProfileView };
