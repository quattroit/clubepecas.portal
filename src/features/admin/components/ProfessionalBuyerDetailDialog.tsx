"use client";

import { Loader2 } from "lucide-react";

import { AdminStatusBadge } from "@/components/admin";
import type { AdminStatusVariant } from "@/components/admin";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import type { ProfessionalBuyerDto } from "@/contracts/professional-buyers";
import {
  isProfessionalBuyerActive,
  isProfessionalBuyerPending,
  isProfessionalBuyerSuspended,
} from "@/contracts/professional-buyers";
import { ProfessionalBuyerStatus } from "@/contracts/common/enums";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { formatDate } from "@/utils/formatDate";
import { formatDocumentAuto } from "@/utils/document";
import { formatPostalCodeInput } from "@/utils/postalCode";

type ProfessionalBuyerDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: ProfessionalBuyerDto;
  isLoading?: boolean;
  error?: unknown;
};

function statusVariant(
  status: ProfessionalBuyerStatus,
): AdminStatusVariant {
  if (isProfessionalBuyerActive(status)) return "active";
  if (isProfessionalBuyerPending(status)) return "pending";
  if (isProfessionalBuyerSuspended(status)) return "blocked";
  return "default";
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {label}
      </dt>
      <dd className="text-foreground text-sm">{value?.trim() || "—"}</dd>
    </div>
  );
}

function ProfessionalBuyerDetailDialog({
  open,
  onOpenChange,
  data,
  isLoading = false,
  error,
}: ProfessionalBuyerDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes do comprador profissional</DialogTitle>
          <DialogDescription>
            Dados cadastrais e status do perfil.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="text-muted-foreground flex items-center gap-2 py-8 text-sm">
            <Loader2 className="size-4 animate-spin" />
            Carregando…
          </div>
        ) : error ? (
          <ErrorMessage
            title="Não foi possível carregar o comprador"
            message={getFriendlyErrorMessage(error)}
          />
        ) : data ? (
          <div className="flex max-h-[70vh] flex-col gap-6 overflow-y-auto">
            <div className="flex flex-wrap items-center gap-3">
              <AdminStatusBadge
                status={statusVariant(data.status)}
                label={data.statusLabel}
              />
              <span className="text-muted-foreground text-sm">
                {data.segmentLabel}
              </span>
            </div>

            <dl className="grid gap-4 sm:grid-cols-2">
              <DetailRow label="Nome fantasia" value={data.companyName} />
              <DetailRow label="Razão social" value={data.corporateName} />
              <DetailRow
                label="Documento"
                value={formatDocumentAuto(data.document)}
              />
              <DetailRow label="Contato" value={data.contactName} />
              <DetailRow label="E-mail" value={data.email} />
              <DetailRow label="Telefone" value={data.phone} />
              <DetailRow label="WhatsApp" value={data.whatsApp} />
              <DetailRow
                label="Cidade / UF"
                value={`${data.city} / ${data.state}`}
              />
              <DetailRow
                label="CEP"
                value={formatPostalCodeInput(data.zipCode)}
              />
              <DetailRow label="Logradouro" value={data.address} />
              <DetailRow label="Número" value={data.number} />
              <DetailRow label="Bairro" value={data.neighborhood} />
              <DetailRow label="Cadastro" value={formatDate(data.createdAt)} />
              <DetailRow
                label="Atualizado em"
                value={data.updatedAt ? formatDate(data.updatedAt) : null}
              />
            </dl>
          </div>
        ) : null}

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>
            Fechar
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ProfessionalBuyerDetailDialog };
