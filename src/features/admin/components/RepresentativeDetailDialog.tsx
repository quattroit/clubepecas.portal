"use client";

import { Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminStatusBadge } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import type { AdminRepresentativeDetailDto } from "@/contracts/admin/representatives";
import { isRepresentativeActive } from "@/contracts/admin/representatives";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { formatDate } from "@/utils/formatDate";
import { formatDocumentInput } from "@/utils/document";
import { PersonType } from "@/contracts/common/enums";
import { formatPostalCodeInput } from "@/utils/postalCode";

type RepresentativeDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: AdminRepresentativeDetailDto;
  isLoading?: boolean;
  error?: unknown;
};

async function copyCode(code: string) {
  try {
    await navigator.clipboard.writeText(code);
    toast.success("Código copiado.");
  } catch {
    toast.error("Não foi possível copiar o código.");
  }
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

function RepresentativeDetailDialog({
  open,
  onOpenChange,
  data,
  isLoading = false,
  error,
}: RepresentativeDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Detalhes do representante</DialogTitle>
          <DialogDescription>
            Dados cadastrais e endereço completo.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="text-muted-foreground flex items-center gap-2 py-8 text-sm">
            <Loader2 className="size-4 animate-spin" />
            Carregando…
          </div>
        ) : error ? (
          <ErrorMessage
            title="Não foi possível carregar o representante"
            message={getFriendlyErrorMessage(error)}
          />
        ) : data ? (
          <div className="flex max-h-[65vh] flex-col gap-6 overflow-y-auto">
            <div className="bg-muted/40 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3">
              <div>
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Código
                </p>
                <p className="font-mono text-lg font-semibold">
                  {data.representativeCode}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <AdminStatusBadge
                  status={
                    isRepresentativeActive(data.status) ? "active" : "inactive"
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void copyCode(data.representativeCode)}
                >
                  <Copy className="size-3.5" />
                  Copiar Código
                </Button>
              </div>
            </div>

            <section>
              <h3 className="text-foreground mb-3 text-sm font-semibold">
                Dados pessoais
              </h3>
              <dl className="grid gap-3 sm:grid-cols-2">
                <DetailRow label="Nome" value={data.name} />
                <DetailRow
                  label="CPF"
                  value={formatDocumentInput(
                    data.document,
                    PersonType.Individual,
                  )}
                />
                <DetailRow label="E-mail" value={data.email} />
                <DetailRow label="Telefone" value={data.phone} />
              </dl>
            </section>

            <section>
              <h3 className="text-foreground mb-3 text-sm font-semibold">
                Endereço
              </h3>
              <dl className="grid gap-3 sm:grid-cols-2">
                <DetailRow
                  label="CEP"
                  value={formatPostalCodeInput(data.zipCode)}
                />
                <DetailRow label="Número" value={data.addressNumber} />
                <DetailRow label="Logradouro" value={data.addressStreet} />
                <DetailRow
                  label="Complemento"
                  value={data.addressComplement}
                />
                <DetailRow label="Bairro" value={data.neighborhood} />
                <DetailRow
                  label="Cidade / UF"
                  value={`${data.city} / ${data.state}`}
                />
              </dl>
            </section>

            <section>
              <h3 className="text-foreground mb-3 text-sm font-semibold">
                Datas
              </h3>
              <dl className="grid gap-3 sm:grid-cols-2">
                <DetailRow
                  label="Cadastro"
                  value={formatDate(data.createdAt)}
                />
                <DetailRow
                  label="Atualização"
                  value={
                    data.updatedAt ? formatDate(data.updatedAt) : null
                  }
                />
              </dl>
            </section>
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

export { RepresentativeDetailDialog };
