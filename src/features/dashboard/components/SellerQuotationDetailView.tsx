"use client";

import { useParams } from "next/navigation";
import { MessageCircle, Receipt } from "lucide-react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { NotFound } from "@/components/feedback/NotFound";
import { PageLoader } from "@/components/feedback/PageLoader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { QuotationStatusBadge } from "@/features/professional-buyer/components/QuotationStatusBadge";
import { useSellerQuotation } from "@/hooks/api/useSellerQuotation";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { NotFoundError } from "@/lib/errors";
import { formatDate, formatTime } from "@/utils/formatDate";
import { parseRouteId } from "@/utils/parseRouteId";

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {label}
      </dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}

/**
 * Detalhe de uma cotação recebida pela loja — somente leitura.
 */
function SellerQuotationDetailView() {
  const params = useParams<{ id: string }>();
  const id = parseRouteId(params.id);

  const detailQuery = useSellerQuotation(id ?? 0, Boolean(id));

  if (!id) {
    return (
      <NotFound
        title="Cotação não encontrada"
        description="O identificador informado é inválido."
        homeHref={ROUTES.SELLER_QUOTATIONS}
      />
    );
  }

  if (detailQuery.isLoading) {
    return <PageLoader label="Carregando cotação…" />;
  }

  if (detailQuery.isError) {
    if (detailQuery.error instanceof NotFoundError) {
      return (
        <NotFound
          title="Cotação não encontrada"
          description="Esta cotação não existe ou não pertence à sua loja."
          homeHref={ROUTES.SELLER_QUOTATIONS}
        />
      );
    }

    return (
      <ErrorMessage
        title="Não foi possível carregar a cotação"
        message={getFriendlyErrorMessage(detailQuery.error)}
      />
    );
  }

  const data = detailQuery.data;
  if (!data) {
    return (
      <NotFound
        title="Cotação não encontrada"
        homeHref={ROUTES.SELLER_QUOTATIONS}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-h1">Cotação {data.number}</h1>
          <p className="text-small text-muted-foreground">
            Recebida em {formatDate(data.submittedAtUtc)} às{" "}
            {formatTime(data.submittedAtUtc)}
          </p>
        </div>
        <QuotationStatusBadge status={data.status} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-h3">Comprador</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <DetailField label="Nome" value={data.buyerName} />
            <DetailField
              label="Empresa"
              value={data.buyerCompanyName ?? "—"}
            />
            <DetailField
              label="WhatsApp"
              value={data.buyerWhatsApp ?? "—"}
            />
          </dl>
          {data.buyerWhatsApp ? (
            <a
              href={`https://wa.me/${data.buyerWhatsApp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-whatsapp mt-3 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
            >
              <MessageCircle className="size-4" aria-hidden />
              Conversar no WhatsApp
            </a>
          ) : null}
        </CardContent>
      </Card>

      {data.generalNotes ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-h3">Observações gerais</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-small whitespace-pre-wrap">
              {data.generalNotes}
            </p>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-h3">
            Itens ({data.items.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {data.items.map((item) => (
            <div
              key={item.id}
              className="border-border flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-start"
            >
              <div className="bg-secondary flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                {item.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- miniatura remota do anúncio
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="size-full object-cover"
                  />
                ) : (
                  <Receipt className="text-muted-foreground size-6" aria-hidden />
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="text-small font-medium">{item.title}</p>
                <p className="text-muted-foreground text-xs">
                  Código: {item.advertisementCode}
                </p>
                <p className="text-sm">Quantidade: {item.quantity}</p>
                {item.itemNotes ? (
                  <p className="text-muted-foreground text-sm">
                    Observação: {item.itemNotes}
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export { SellerQuotationDetailView };
