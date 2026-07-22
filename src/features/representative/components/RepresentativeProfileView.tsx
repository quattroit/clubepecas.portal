"use client";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminStatusBadge } from "@/components/admin";
import type { RepresentativeMeDto } from "@/contracts/representative/portal";
import { isRepresentativeActive } from "@/contracts/admin/representatives";
import { RepresentativeChangePasswordForm } from "@/features/representative/components/RepresentativeChangePasswordForm";
import { RepresentativeProfileForm } from "@/features/representative/components/RepresentativeProfileForm";
import type { RepresentativeProfileFormValues } from "@/features/representative/schemas/representativeProfileFormSchema";
import { useRepresentativeMe } from "@/hooks/api/useRepresentativeMe";
import { useUpdateRepresentativeMe } from "@/hooks/api/useUpdateRepresentativeMe";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import {
  documentLabel,
  formatDocumentAuto,
  inferPersonTypeFromDocument,
} from "@/utils/document";
import { formatPostalCodeInput, normalizePostalCode } from "@/utils/postalCode";

function mapMeToFormValues(
  dto: RepresentativeMeDto,
): RepresentativeProfileFormValues {
  return {
    name: dto.name,
    phone: dto.phone,
    zipCode: formatPostalCodeInput(dto.zipCode),
    addressStreet: dto.addressStreet,
    addressNumber: dto.addressNumber,
    addressComplement: dto.addressComplement ?? "",
    neighborhood: dto.neighborhood,
    city: dto.city,
    state: dto.state,
  };
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {label}
      </dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}

function RepresentativeProfileView() {
  const meQuery = useRepresentativeMe();
  const updateMutation = useUpdateRepresentativeMe();

  const handleSubmit = (values: RepresentativeProfileFormValues) => {
    updateMutation.mutate({
      name: values.name.trim(),
      phone: values.phone,
      zipCode: normalizePostalCode(values.zipCode),
      addressStreet: values.addressStreet.trim(),
      addressNumber: values.addressNumber.trim(),
      addressComplement: values.addressComplement.trim() || null,
      neighborhood: values.neighborhood.trim(),
      city: values.city.trim(),
      state: values.state.trim().toUpperCase(),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-h1">Meu perfil</h1>
        <p className="text-small text-muted-foreground">
          Gerencie seus dados de contato e endereço.
        </p>
      </div>

      {meQuery.isError ? (
        <ErrorMessage
          title="Não foi possível carregar o perfil"
          message={getFriendlyErrorMessage(meQuery.error)}
        />
      ) : null}

      {meQuery.isLoading ? (
        <Card className="w-full max-w-2xl">
          <CardContent className="flex flex-col gap-3 pt-6">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ) : null}

      {meQuery.data ? (
        <>
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="text-h3">Dados da conta</CardTitle>
              <p className="text-small text-muted-foreground">
                Estes dados não podem ser alterados por aqui.
              </p>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2">
                <ReadOnlyField label="Código" value={meQuery.data.representativeCode} />
                <ReadOnlyField label="E-mail" value={meQuery.data.email} />
                <ReadOnlyField
                  label={
                    (() => {
                      const personType = inferPersonTypeFromDocument(
                        meQuery.data.document,
                      );
                      return personType != null
                        ? documentLabel(personType)
                        : "CPF/CNPJ";
                    })()
                  }
                  value={formatDocumentAuto(meQuery.data.document)}
                />
                <div className="flex flex-col gap-0.5">
                  <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    Status
                  </dt>
                  <dd>
                    <AdminStatusBadge
                      status={
                        isRepresentativeActive(meQuery.data.status)
                          ? "active"
                          : "inactive"
                      }
                    />
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <RepresentativeProfileForm
            key={meQuery.data.id}
            defaultValues={mapMeToFormValues(meQuery.data)}
            isSubmitting={updateMutation.isPending}
            submitError={updateMutation.isError ? updateMutation.error : undefined}
            onSubmit={handleSubmit}
          />

          <RepresentativeChangePasswordForm />
        </>
      ) : null}
    </div>
  );
}

export { RepresentativeProfileView };
