"use client";

import { useState } from "react";
import { Copy, ExternalLink, QrCode, Share2 } from "lucide-react";

import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RepresentativeQrCodeDialog } from "@/features/admin/components/RepresentativeQrCodeDialog";
import { useRepresentativeReferralLink } from "@/hooks/api/useRepresentativeReferralLink";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import {
  copyRepresentativePublicLink,
  getRepresentativePublicUrl,
  openRepresentativePublicLink,
  shareRepresentativePublicLink,
} from "@/utils/representativePublicLink";

function RepresentativeLinkView() {
  const linkQuery = useRepresentativeReferralLink();
  const [qrOpen, setQrOpen] = useState(false);

  const code = linkQuery.data?.representativeCode ?? "";
  const publicUrl = code ? getRepresentativePublicUrl(code) : "";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-h1">Link de indicação</h1>
        <p className="text-small text-muted-foreground">
          Compartilhe seu link público para indicar novos vendedores ao
          ClubePeças.
        </p>
      </div>

      {linkQuery.isError ? (
        <ErrorMessage
          title="Não foi possível carregar o link de indicação"
          message={getFriendlyErrorMessage(linkQuery.error)}
        />
      ) : null}

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-h3">Seu link público</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {linkQuery.isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <div className="border-border bg-muted/30 flex flex-col gap-1 rounded-xl border px-4 py-3">
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Código {code}
              </p>
              <p className="text-foreground truncate font-mono text-sm font-medium">
                {publicUrl}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!code}
              onClick={() => void copyRepresentativePublicLink(code)}
            >
              <Copy className="size-3.5" />
              Copiar link
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!code}
              onClick={() => openRepresentativePublicLink(code)}
            >
              <ExternalLink className="size-3.5" />
              Abrir link
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!code}
              onClick={() =>
                void shareRepresentativePublicLink(code, linkQuery.data?.name)
              }
            >
              <Share2 className="size-3.5" />
              Compartilhar
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={!code}
              onClick={() => setQrOpen(true)}
            >
              <QrCode className="size-3.5" />
              Gerar QR Code
            </Button>
          </div>
        </CardContent>
      </Card>

      <RepresentativeQrCodeDialog
        open={qrOpen}
        onOpenChange={setQrOpen}
        representativeCode={code}
        representativeName={linkQuery.data?.name}
      />
    </div>
  );
}

export { RepresentativeLinkView };
