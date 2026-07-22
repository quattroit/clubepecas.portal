"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Copy,
  ExternalLink,
  Loader2,
  QrCode,
  Share2,
} from "lucide-react";
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
import { Button, buttonVariants } from "@/components/ui/button";
import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { Pagination } from "@/components/navigation/Pagination";
import type { AdminRepresentativeDetailDto } from "@/contracts/admin/representatives";
import { isRepresentativeActive } from "@/contracts/admin/representatives";
import { adminSellerPath } from "@/constants/routes";
import { RepresentativeQrCodeDialog } from "@/features/admin/components/RepresentativeQrCodeDialog";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatDate";
import { formatDocumentInput } from "@/utils/document";
import { PersonType } from "@/contracts/common/enums";
import { formatPostalCodeInput } from "@/utils/postalCode";
import {
  copyRepresentativePublicLink,
  getRepresentativePublicUrl,
  openRepresentativePublicLink,
  shareRepresentativePublicLink,
} from "@/utils/representativePublicLink";

type RepresentativeDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: AdminRepresentativeDetailDto;
  isLoading?: boolean;
  error?: unknown;
  sellersPage?: number;
  onSellersPageChange?: (page: number) => void;
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
  sellersPage = 1,
  onSellersPageChange,
}: RepresentativeDetailDialogProps) {
  const [tab, setTab] = useState<"dados" | "vendedores">("dados");
  const [qrOpen, setQrOpen] = useState(false);
  const publicUrl = data
    ? getRepresentativePublicUrl(data.representativeCode)
    : "";

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes do representante</DialogTitle>
          <DialogDescription>
            Dados cadastrais, resumo e vendedores indicados.
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
          <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto">
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

            <div className="bg-muted/30 rounded-xl border px-4 py-3">
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Link Público
              </p>
              <p className="mt-1 truncate font-mono text-sm" title={publicUrl}>
                {publicUrl}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    void copyRepresentativePublicLink(data.representativeCode)
                  }
                >
                  <Copy className="size-3.5" />
                  Copiar Link
                </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      openRepresentativePublicLink(data.representativeCode)
                    }
                  >
                    <ExternalLink className="size-3.5" />
                    Abrir Link
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      openRepresentativePublicLink(data.representativeCode)
                    }
                  >
                    <ExternalLink className="size-3.5" />
                    Testar Link
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      void shareRepresentativePublicLink(
                        data.representativeCode,
                        data.name,
                      )
                    }
                  >
                    <Share2 className="size-3.5" />
                    Compartilhar
                  </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setQrOpen(true)}
                >
                  <QrCode className="size-3.5" />
                  Gerar QR Code
                </Button>
              </div>
            </div>

            <div className="bg-muted/30 rounded-xl border px-4 py-3">
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Resumo
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">
                {data.totalSellers}
              </p>
              <p className="text-muted-foreground text-xs">
                vendedores vinculados
              </p>
            </div>

            <div className="flex gap-2 border-b pb-2">
              <Button
                type="button"
                size="sm"
                variant={tab === "dados" ? "primary" : "ghost"}
                onClick={() => setTab("dados")}
              >
                Dados
              </Button>
              <Button
                type="button"
                size="sm"
                variant={tab === "vendedores" ? "primary" : "ghost"}
                onClick={() => setTab("vendedores")}
              >
                Vendedores Indicados
              </Button>
            </div>

            {tab === "dados" ? (
              <>
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
              </>
            ) : (
              <section className="flex flex-col gap-3">
                {(data.sellers?.length ?? 0) === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    Nenhum vendedor vinculado a este representante.
                  </p>
                ) : (
                  <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-muted/40 text-muted-foreground text-xs">
                        <tr>
                          <th className="px-3 py-2 font-medium">Nome</th>
                          <th className="px-3 py-2 font-medium">E-mail</th>
                          <th className="px-3 py-2 font-medium">Plano</th>
                          <th className="px-3 py-2 font-medium">Status</th>
                          <th className="px-3 py-2 font-medium">Cadastro</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.sellers.map((seller) => (
                          <tr key={seller.id} className="border-t">
                            <td className="px-3 py-2">
                              <Link
                                href={adminSellerPath(seller.id)}
                                className={cn(
                                  buttonVariants({
                                    variant: "link",
                                    size: "sm",
                                  }),
                                  "h-auto px-0",
                                )}
                              >
                                {seller.storeName || seller.displayName}
                              </Link>
                            </td>
                            <td className="px-3 py-2">{seller.email || "—"}</td>
                            <td className="px-3 py-2">{seller.planLabel}</td>
                            <td className="px-3 py-2">
                              <AdminStatusBadge
                                status={
                                  seller.isActive ? "active" : "inactive"
                                }
                              />
                            </td>
                            <td className="px-3 py-2">
                              {formatDate(seller.createdAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {(data.sellersTotalPages ?? 0) > 1 && onSellersPageChange ? (
                  <Pagination
                    currentPage={data.sellersCurrentPage ?? sellersPage}
                    totalPages={data.sellersTotalPages}
                    onPageChange={onSellersPageChange}
                  />
                ) : null}
              </section>
            )}
          </div>
        ) : null}

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>
            Fechar
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {data ? (
      <RepresentativeQrCodeDialog
        open={qrOpen}
        onOpenChange={setQrOpen}
        representativeCode={data.representativeCode}
        representativeName={data.name}
      />
    ) : null}
    </>
  );
}

export { RepresentativeDetailDialog };
